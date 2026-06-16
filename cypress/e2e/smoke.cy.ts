describe("Smoke", () => {
  it("carrega a home", () => {
    cy.visit("/");
    cy.contains(/create next app|whatsapp|campaign/i);
  });
});
