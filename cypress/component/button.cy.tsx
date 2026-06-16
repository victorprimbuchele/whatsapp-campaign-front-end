import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renderiza", () => {
    cy.mount(<Button>OK</Button>);
    cy.contains("OK");
  });
});
