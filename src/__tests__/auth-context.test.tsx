import { render } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

function Consumer({ children }: { children?: ReactNode }) {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="has-user">{user ? "yes" : "no"}</span>
      <span data-testid="loading">{loading ? "yes" : "no"}</span>
      {children}
    </div>
  );
}

describe("AuthContext", () => {
  it("provides user and loading state", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(getByTestId("has-user").textContent).toBe("no");
  });
});
