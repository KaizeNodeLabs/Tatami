"use client";

import React, { Suspense } from "react";

type TestStatus = "Passed" | "Failed" | "Pending";

interface Test {
  title: string;
  status: TestStatus;
  description: string;
  file: string;
  runtime: string;
  code: string;
}

const mockTests: Test[] = [
  {
    title: "should create user successfully",
    status: "Passed",
    description: "Verifies that a user is created correctly with valid data",
    file: "user.test.js",
    runtime: "12ms",
    code: `test('should create user successfully', async () => {
  const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
  const user = await createUser(userData);
  expect(user).toBeDefined();
  expect(user.email).toBe('john@example.com');
});`,
  },
  {
    title: "should validate email format",
    status: "Failed",
    description: "Checks that email has a valid format before creating user",
    file: "user.test.js",
    runtime: "8ms",
    code: `test('should validate email format', () => {
  const invalidEmails = ['invalid-email', 'test@', '@example.com'];
  invalidEmails.forEach(email => {
    expect(() => validateEmail(email)).toThrow();
  });
});`,
  },
  {
    title: "should authenticate user with correct credentials",
    status: "Passed",
    description: "Verifies that authentication works with correct credentials",
    file: "auth.test.js",
    runtime: "45ms",
    code: `test('should authenticate user', async () => {
  const credentials = { email: 'user@test.com', password: 'correctPassword' };
  const result = await authenticateUser(credentials);
  expect(result.success).toBe(true);
  expect(result.token).toBeDefined();
});`,
  },
  {
    title: "should handle API rate limiting",
    status: "Pending",
    description: "Verifies that the API properly handles rate limits",
    file: "api.test.js",
    runtime: "0ms",
    code: `test.skip('should handle rate limiting', async () => {
  const requests = Array(100).fill().map(() => apiCall());
  const responses = await Promise.all(requests);
  expect(responses.filter(r => r.status === 429)).toHaveLength.toBeGreaterThan(0);
});`,
  },
  {
    title: "should hash password before storing",
    status: "Passed",
    description: "Checks that passwords are encrypted before being saved",
    file: "auth.test.js",
    runtime: "23ms",
    code: `test('should hash password', async () => {
  const plainPassword = 'myPassword123';
  const hashedPassword = await hashPassword(plainPassword);
  expect(hashedPassword).not.toBe(plainPassword);
  expect(hashedPassword.length).toBeGreaterThan(20);
});`,
  },
  {
    title: "should format currency correctly",
    status: "Passed",
    description: "Checks that monetary values are formatted correctly",
    file: "utils.test.js",
    runtime: "5ms",
    code: `test('should format currency', () => {
  expect(formatCurrency(1000)).toBe('$1,000.00');
  expect(formatCurrency(99.5)).toBe('$99.50');
  expect(formatCurrency(0)).toBe('$0.00');
});`,
  },
];

const statusColors: Record<TestStatus, string> = {
  Passed: "var(--success-color)",
  Failed: "var(--danger-color)",
  Pending: "var(--warning-color)",
};

function TestCard({ test }: { test: Test }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);

  // Map status to the correct badge class
  const getBadgeClass = (status: TestStatus): string => {
    const statusMap: Record<TestStatus, string> = {
      'Passed': 'badge-passed',
      'Failed': 'badge-failed',
      'Pending': 'badge-pending'
    };
    return statusMap[status];
  };

  const handleViewDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRunTest = async () => {
    setIsRunning(true);
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRunning(false);
  };

  return (
    <div 
      className="unit-test-card"
      style={{ borderColor: statusColors[test.status] }}
    >
      <div className="unit-test-card-header">
        <span className="unit-test-title">{test.title}</span>
        <span className={`badge ${getBadgeClass(test.status)}`}>
          {test.status}
        </span>
      </div>
      <div className="unit-test-desc">{test.description}</div>
      <div className="unit-test-meta">
        <span>{test.file}</span>
        <span>{test.runtime}</span>
      </div>
      
      {isExpanded && (
        <div className="unit-test-code-container">
          <pre className="unit-test-code">{test.code}</pre>
        </div>
      )}
      
      <div className="unit-test-actions">
        <button 
          onClick={handleViewDetails}
          className="btn-secondary"
        >
          {isExpanded ? "Hide details" : "View details"}
        </button>
        <button 
          onClick={handleRunTest}
          disabled={isRunning}
          className="btn-primary"
        >
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
}

function UnitTestsContent() {
  const [activeFilter, setActiveFilter] = React.useState<string>("All");
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const filteredTests = React.useMemo(() => {
    let filtered = mockTests;
    
    // Apply status filter
    if (activeFilter !== "All") {
      filtered = filtered.filter(test => test.status === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.file.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [activeFilter, searchTerm]);

  const testCounts = React.useMemo(() => {
    const passed = mockTests.filter(t => t.status === "Passed").length;
    const failed = mockTests.filter(t => t.status === "Failed").length;
    const pending = mockTests.filter(t => t.status === "Pending").length;
    return { passed, failed, pending, total: mockTests.length };
  }, []);

  return (
    <div className="unit-tests-root">
      <header className="unit-tests-header">
        <h1>Unit Tests</h1>
        <div className="unit-tests-summary">
          <span className="passed">✓ {testCounts.passed} passed</span>
          <span className="failed">✗ {testCounts.failed} failed</span>
          <span className="pending">⧗ {testCounts.pending} pending</span>
          <span className="total">● {testCounts.total} total</span>
        </div>
        <div className="unit-tests-filters">
          {["All", "Passed", "Failed", "Pending"].map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
          <input
            type="search"
            className="unit-tests-search"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <main className="unit-tests-grid">
        {filteredTests.map((test, idx) => (
          <TestCard key={`${test.file}-${idx}`} test={test} />
        ))}
        {filteredTests.length === 0 && (
          <div className="no-results">
            <p>No tests found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function UnitTestsPage() {
  return (
    <Suspense fallback={<div>Loading tests...</div>}>
      <UnitTestsContent />
    </Suspense>
  );
}