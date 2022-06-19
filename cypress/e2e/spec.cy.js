describe("Home Page", () => {
  it("successfully loads", () => {
    cy.visit("http://localhost:3000");
    cy.contains("h1", "Mint Feed");
  });

  it("Links to /login", () => {
    cy.contains("Log in").click();
    cy.contains(".loader", "Wen Lambo?");
  });
});
