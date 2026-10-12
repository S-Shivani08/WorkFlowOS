package app.config;

import app.model.*;
import app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final WorkflowRepository workflowRepository;
    private final WorkflowStepRepository workflowStepRepository;
    private final RequestRepository requestRepository;
    private final ApprovalRepository approvalRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(DepartmentRepository departmentRepository,
                           UserRepository userRepository,
                           WorkflowRepository workflowRepository,
                           WorkflowStepRepository workflowStepRepository,
                           RequestRepository requestRepository,
                           ApprovalRepository approvalRepository,
                           StatusHistoryRepository statusHistoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.workflowRepository = workflowRepository;
        this.workflowStepRepository = workflowStepRepository;
        this.requestRepository = requestRepository;
        this.approvalRepository = approvalRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Initialize Departments
        Department hr = initDepartment("Human Resources", "HR", "Employee relations, payroll, talent acquisition, and company policies");
        Department fin = initDepartment("Finance & Accounts", "FIN", "Budgeting, procurement, expense reimbursements, and auditing");
        Department it = initDepartment("Information Technology", "IT", "Cloud infrastructure, enterprise software, cybersecurity, and hardware assets");
        Department ops = initDepartment("Operations & Logistics", "OPS", "Facilities, administrative vendor management, and internal company operations");

        // 2. Initialize Corporate Users with secure BCrypt hashes
        String defaultPass = passwordEncoder.encode("password123");

        User admin = initUser("Admin User", "admin@workflowos.com", defaultPass, Role.ROLE_ADMIN, it, "System Administrator", "+1-555-0100");
        User hrHead = initUser("Rachel Adams", "hr.head@workflowos.com", defaultPass, Role.ROLE_DEPT_HEAD, hr, "Head of Human Resources", "+1-555-0101");
        User hrManager = initUser("Marcus Vance", "hr.manager@workflowos.com", defaultPass, Role.ROLE_MANAGER, hr, "HR Operations Manager", "+1-555-0102");
        User finHead = initUser("Elena Rostova", "finance.head@workflowos.com", defaultPass, Role.ROLE_DEPT_HEAD, fin, "Head of Finance / CFO", "+1-555-0103");
        User finManager = initUser("David Chen", "finance.manager@workflowos.com", defaultPass, Role.ROLE_MANAGER, fin, "Finance Approvals Manager", "+1-555-0104");
        User itHead = initUser("Vikram Malhotra", "it.head@workflowos.com", defaultPass, Role.ROLE_DEPT_HEAD, it, "VP of Technology & IT", "+1-555-0105");
        User itManager = initUser("Sophia Garcia", "it.manager@workflowos.com", defaultPass, Role.ROLE_MANAGER, it, "IT Infrastructure Manager", "+1-555-0106");
        User opsHead = initUser("Thomas Wright", "ops.head@workflowos.com", defaultPass, Role.ROLE_DEPT_HEAD, ops, "Director of Operations", "+1-555-0107");
        User alex = initUser("Alex Turner", "alex.employee@workflowos.com", defaultPass, Role.ROLE_EMPLOYEE, it, "Senior Software Engineer", "+1-555-0108");
        User sarah = initUser("Sarah Jenkins", "sarah.employee@workflowos.com", defaultPass, Role.ROLE_EMPLOYEE, fin, "Financial Analyst", "+1-555-0109");

        // 3. Initialize Standard Workflows
        initWorkflows(hrHead, finHead, finManager, itHead, itManager, opsHead);

        // 4. Initialize Sample Requests if table is empty
        if (requestRepository.count() == 0) {
            initSampleRequests(alex, sarah, it, fin);
        }
    }

    private Department initDepartment(String name, String code, String desc) {
        return departmentRepository.findByCode(code).orElseGet(() -> {
            Department d = new Department();
            d.setName(name);
            d.setCode(code);
            d.setDescription(desc);
            return departmentRepository.save(d);
        });
    }

    private User initUser(String name, String email, String encodedPass, Role role, Department dept, String title, String phone) {
        return userRepository.findByEmail(email).map(existing -> {
            existing.setPassword(encodedPass);
            existing.setRole(role);
            existing.setDepartment(dept);
            existing.setJobTitle(title);
            existing.setPhone(phone);
            existing.setActive(true);
            return userRepository.save(existing);
        }).orElseGet(() -> {
            User u = new User();
            u.setName(name);
            u.setEmail(email);
            u.setPassword(encodedPass);
            u.setRole(role);
            u.setDepartment(dept);
            u.setJobTitle(title);
            u.setPhone(phone);
            u.setActive(true);
            return userRepository.save(u);
        });
    }

    private void initWorkflows(User hrHead, User finHead, User finManager, User itHead, User itManager, User opsHead) {
        // Workflow 1: LEAVE
        if (workflowRepository.findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType.LEAVE).isEmpty()) {
            Workflow leaveWf = new Workflow();
            leaveWf.setName("Standard Corporate Leave Approval Workflow");
            leaveWf.setRequestType(RequestType.LEAVE);
            leaveWf.setDescription("2-Step Approval: Employee Department Manager -> HR Department Head Final Sign-off");
            leaveWf.setActive(true);
            Workflow saved = workflowRepository.save(leaveWf);

            WorkflowStep step1 = new WorkflowStep(null, saved, 1, "Direct Department Manager Review", ApproverRule.ROLE_IN_DEPT, Role.ROLE_MANAGER, null);
            WorkflowStep step2 = new WorkflowStep(null, saved, 2, "HR Department Head Authorization", ApproverRule.SPECIFIC_USER, Role.ROLE_DEPT_HEAD, hrHead);
            workflowStepRepository.save(step1);
            workflowStepRepository.save(step2);
        }

        // Workflow 2: PURCHASE
        if (workflowRepository.findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType.PURCHASE).isEmpty()) {
            Workflow purchaseWf = new Workflow();
            purchaseWf.setName("Corporate Asset & Equipment Purchase Workflow");
            purchaseWf.setRequestType(RequestType.PURCHASE);
            purchaseWf.setDescription("3-Step Authorization: Department Head Review -> Finance Manager Audit -> CFO Final Sign-off");
            purchaseWf.setActive(true);
            Workflow saved = workflowRepository.save(purchaseWf);

            WorkflowStep step1 = new WorkflowStep(null, saved, 1, "Department Head Verification", ApproverRule.DEPT_HEAD, Role.ROLE_DEPT_HEAD, null);
            WorkflowStep step2 = new WorkflowStep(null, saved, 2, "Finance Manager Budget Audit", ApproverRule.SPECIFIC_USER, Role.ROLE_MANAGER, finManager);
            WorkflowStep step3 = new WorkflowStep(null, saved, 3, "CFO / Finance Head Executive Approval", ApproverRule.SPECIFIC_USER, Role.ROLE_DEPT_HEAD, finHead);
            workflowStepRepository.save(step1);
            workflowStepRepository.save(step2);
            workflowStepRepository.save(step3);
        }

        // Workflow 3: REIMBURSEMENT
        if (workflowRepository.findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType.REIMBURSEMENT).isEmpty()) {
            Workflow reimbWf = new Workflow();
            reimbWf.setName("Employee Expense Reimbursement Workflow");
            reimbWf.setRequestType(RequestType.REIMBURSEMENT);
            reimbWf.setDescription("2-Step Verification: Department Manager -> Finance Manager Disbursement");
            reimbWf.setActive(true);
            Workflow saved = workflowRepository.save(reimbWf);

            WorkflowStep step1 = new WorkflowStep(null, saved, 1, "Department Manager Expense Check", ApproverRule.ROLE_IN_DEPT, Role.ROLE_MANAGER, null);
            WorkflowStep step2 = new WorkflowStep(null, saved, 2, "Finance Manager Payment Clearance", ApproverRule.SPECIFIC_USER, Role.ROLE_MANAGER, finManager);
            workflowStepRepository.save(step1);
            workflowStepRepository.save(step2);
        }

        // Workflow 4: IT_SUPPORT
        if (workflowRepository.findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType.IT_SUPPORT).isEmpty()) {
            Workflow itWf = new Workflow();
            itWf.setName("IT Infrastructure & Cloud Permissions Workflow");
            itWf.setRequestType(RequestType.IT_SUPPORT);
            itWf.setDescription("2-Step Security Pipeline: IT Support Manager -> VP of IT Infrastructure");
            itWf.setActive(true);
            Workflow saved = workflowRepository.save(itWf);

            WorkflowStep step1 = new WorkflowStep(null, saved, 1, "IT Operations Assessment", ApproverRule.SPECIFIC_USER, Role.ROLE_MANAGER, itManager);
            WorkflowStep step2 = new WorkflowStep(null, saved, 2, "VP of IT Security Approval", ApproverRule.SPECIFIC_USER, Role.ROLE_DEPT_HEAD, itHead);
            workflowStepRepository.save(step1);
            workflowStepRepository.save(step2);
        }

        // Workflow 5: ADMIN_REQUEST
        if (workflowRepository.findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType.ADMIN_REQUEST).isEmpty()) {
            Workflow adminWf = new Workflow();
            adminWf.setName("Corporate Facilities & Administrative Workflow");
            adminWf.setRequestType(RequestType.ADMIN_REQUEST);
            adminWf.setDescription("1-Step Routing: Director of Operations Review");
            adminWf.setActive(true);
            Workflow saved = workflowRepository.save(adminWf);

            WorkflowStep step1 = new WorkflowStep(null, saved, 1, "Operations Directorate Authorization", ApproverRule.SPECIFIC_USER, Role.ROLE_DEPT_HEAD, opsHead);
            workflowStepRepository.save(step1);
        }
    }

    private void initSampleRequests(User alex, User sarah, Department it, Department fin) {
        Workflow leaveWf = workflowRepository.findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType.LEAVE).orElse(null);
        Workflow purchaseWf = workflowRepository.findFirstByRequestTypeAndDepartmentIsNullAndIsActiveTrue(RequestType.PURCHASE).orElse(null);

        if (leaveWf != null) {
            WorkflowStep step1 = workflowStepRepository.findFirstByWorkflowOrderByStepOrderAsc(leaveWf).orElse(null);
            User itMgr = userRepository.findByEmail("it.manager@workflowos.com").orElse(null);

            Request r1 = new Request();
            r1.setRequester(alex);
            r1.setRequestType(RequestType.LEAVE);
            r1.setTitle("Annual Paid Vacation (5 Days)");
            r1.setDescription("Annual family vacation request. Handed over pending pull requests to team.");
            r1.setDepartment(it);
            r1.setWorkflow(leaveWf);
            r1.setCurrentStep(step1);
            r1.setCurrentApprover(itMgr);
            r1.setStatus(RequestStatus.PENDING_APPROVAL);
            r1.setPriority(Priority.MEDIUM);
            r1.setStartDate(LocalDate.now().plusDays(14));
            r1.setEndDate(LocalDate.now().plusDays(19));
            r1.setSubmittedAt(LocalDateTime.now().minusHours(3));
            Request savedR1 = requestRepository.save(r1);

            Approval app1 = new Approval(null, savedR1, step1, itMgr, Decision.PENDING, null);
            approvalRepository.save(app1);

            StatusHistory h1 = new StatusHistory(null, savedR1, "DRAFT", "PENDING_APPROVAL", alex, "SUBMITTED_AND_ROUTED",
                    "Request submitted and routed to Step 1 (Direct Department Manager Review) assigned to Sophia Garcia.");
            statusHistoryRepository.save(h1);
        }

        if (purchaseWf != null) {
            WorkflowStep step1 = workflowStepRepository.findFirstByWorkflowOrderByStepOrderAsc(purchaseWf).orElse(null);
            User itHead = userRepository.findByEmail("it.head@workflowos.com").orElse(null);

            Request r2 = new Request();
            r2.setRequester(alex);
            r2.setRequestType(RequestType.PURCHASE);
            r2.setTitle("High-Performance Engineering Workstation & Dual 4K Displays");
            r2.setDescription("Hardware upgrade required for local Docker microservices and heavy compiling workloads.");
            r2.setDepartment(it);
            r2.setWorkflow(purchaseWf);
            r2.setCurrentStep(step1);
            r2.setCurrentApprover(itHead);
            r2.setStatus(RequestStatus.PENDING_APPROVAL);
            r2.setPriority(Priority.HIGH);
            r2.setAmount(new BigDecimal("2499.00"));
            r2.setSubmittedAt(LocalDateTime.now().minusHours(5));
            Request savedR2 = requestRepository.save(r2);

            Approval app2 = new Approval(null, savedR2, step1, itHead, Decision.PENDING, null);
            approvalRepository.save(app2);

            StatusHistory h2 = new StatusHistory(null, savedR2, "DRAFT", "PENDING_APPROVAL", alex, "SUBMITTED_AND_ROUTED",
                    "Request submitted and routed to Step 1 (Department Head Verification) assigned to Vikram Malhotra.");
            statusHistoryRepository.save(h2);
        }
    }
}
