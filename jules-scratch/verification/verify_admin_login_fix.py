from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("file:///app/packages/web/build/index.html")

        # Fill in the username and password
        page.get_by_placeholder("Usuario").fill("admin")
        page.get_by_placeholder("Contraseña").fill("admin")

        # Click the login button
        page.get_by_role("button", name="Ingresar").click()

        # Wait for the success message to disappear
        expect(page.get_by_text("Ingreso Exitoso")).to_be_hidden(timeout=5000)

        # Wait for the create employee form to be visible
        expect(page.get_by_text("Registrar Nuevo Empleado")).to_be_visible(timeout=5000)

        page.screenshot(path="jules-scratch/verification/admin_login_fix.png")
        browser.close()

run()
