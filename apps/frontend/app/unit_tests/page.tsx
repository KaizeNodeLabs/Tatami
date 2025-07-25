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
    code: `test('should create user successfully', async () => {\n  // ...\n});`,
  },
  {
    title: "should validate email format",
    status: "Failed",
    description: "Checks that email has a valid format before creating user",
    file: "user.test.js",
    runtime: "8ms",
    code: `test('should validate email format', () => {\n  // ...\n});`,
  },
  {
    title: "should authenticate user with correct credentials",
    status: "Passed",
    description: "Verifies that authentication works with correct credentials",
    file: "auth.test.js",
    runtime: "45ms",
    code: `test('should authenticate user', async () => {\n  // ...\n});`,
  },
  {
    title: "should handle concurrent user creation",
    status: "Pending",
    description: "Verifies race conditions in user creation",
    file: "user.test.js",
    runtime: "0ms",
    code: `test('should handle concurrent user creation', async () => {\n  // ...\n});`,
  },
];

const statusColors: Record<TestStatus, string> = {
  Passed: "var(--success-color)",
  Failed: "var(--danger-color)",
  Pending: "var(--warning-color)",
};

function TestCard({ test }: { test: Test }) {
  // Map status to the correct badge class
  const getBadgeClass = (status: TestStatus): string => {
    const statusMap: Record<TestStatus, string> = {
      'Passed': 'badge-passed',
      'Failed': 'badge-failed',
      'Pending': 'badge-pending'
    };
    return statusMap[status];
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
      <pre className="unit-test-code">{test.code}</pre>
      <div className="unit-test-actions">
        <button disabled>View details</button>
        <button disabled>Run</button>
      </div>
    </div>
  );
}

function UnitTestsContent() {
  return (
    <div className="unit-tests-root">
      <header className="unit-tests-header">
        <h1>Unit Tests</h1>
        <div className="unit-tests-summary">
          <span className="passed">✓ 24 passed</span>
          <span className="failed">✗ 3 failed</span>
          <span className="pending">⧗ 2 pending</span>
          <span className="total">2,343 total</span>
        </div>
        <div className="unit-tests-filters">
          <button className="active">All</button>
          <button>Passed</button>
          <button>Failed</button>
          <button>Pending</button>
          <input
            type="search"
            className="unit-tests-search"
            placeholder="Search tests..."
          />
        </div>
      </header>
      <main className="unit-tests-grid">
        {mockTests.map((test, idx) => (
          <TestCard key={`${test.file}-${idx}`} test={test} />
        ))}
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