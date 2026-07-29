// /**
//  * LMS Frontend - Selenium WebDriver Login Automation Tests
//  *
//  * Prerequisites:
//  *   1. Start the backend server:  cd LMS-BE && npm run dev
//  *   2. Start the frontend server: cd lms-fe-next && npm run dev
//  *   3. Ensure Chrome/Chromium is installed
//  *   4. Run this file with:       node test/login.test.js
//  *
//  * The selenium-webdriver package is already installed (v4.46.0).
//  * chromedriver is also installed and will auto-resolve.
//  */

// // ============================================================================
// // SECTION 1: IMPORTS
// // ============================================================================

// // Builder: used to construct a new WebDriver session for a specific browser.
// // By:     represents a locator strategy (e.g., By.id, By.name, By.css).
// // until:  provides expected conditions for explicit waits.
// // Key:    simulates keyboard key presses.
// // Condition: used in wait conditions.
// const {
//   Builder,
//   By,
//   until,
//   Key,
//   Condition,
// } = require("selenium-webdriver");

// // ============================================================================
// // SECTION 2: TEST CONFIGURATION
// // ============================================================================

// // Base URL of the Next.js frontend application.
// const BASE_URL = "http://localhost:3000";

// // API base for creating test users via direct HTTP requests.
// const API_BASE = "http://localhost:8000/api/v1";

// // Test user credentials - change these if your seeded users differ.
// // The backend register endpoint requires: fullName, userName, email, password, phone.
// const TEST_USER = {
//   fullName: "Selenium Test User",
//   userName: "seleniumtest",
//   email: "selenium@test.com",
//   password: "Test1234!",
//   phone: "01700000000",
// };

// // Maximum wait time in milliseconds for explicit waits.
// // Adjust based on your machine speed and network latency.
// const WAIT_TIMEOUT = 10000;

// // ============================================================================
// // SECTION 3: HELPER FUNCTIONS
// // ============================================================================

// /**
//  * Creates and configures a new Chrome WebDriver instance.
//  * Chrome is chosen because chromedriver is already a dependency.
//  */
// async function createDriver() {
//   const driver = await new Builder().forBrowser("chrome").build();

//   // Maximize the browser window so all elements are visible and clickable.
//   await driver.manage().window().maximize();

//   // Set a page load timeout so we don't wait forever on a slow page.
//   await driver.manage().setTimeouts({ pageLoad: WAIT_TIMEOUT });

//   // Set an implicit wait as a safety net, though we primarily use explicit waits.
//   await driver.manage().setTimeouts({ implicit: 2000 });

//   return driver;
// }

// /**
//  * Navigates the browser to the login page.
//  */
// async function openLoginPage(driver) {
//   await driver.get(`${BASE_URL}/login`);
// }

// /**
//  * Waits until the page heading "Login" is visible, confirming the page loaded.
//  */
// async function waitForLoginPage(driver) {
//   const heading = await driver.wait(
//     until.elementLocated(By.css("h1")),
//     WAIT_TIMEOUT
//   );
//   await driver.wait(until.elementIsVisible(heading), WAIT_TIMEOUT);

//   // Verify we are on the correct page by checking the heading text.
//   const text = await heading.getText();
//   if (text !== "Login") {
//     throw new Error(`Expected page heading "Login", but got "${text}"`);
//   }
// }

// /**
//  * Fills the email and password fields on the login form.
//  *
//  * @param {WebDriver} driver
//  * @param {string} email
//  * @param {string} password
//  */
// async function fillLoginForm(driver, email, password) {
//   // Locate the email input by its HTML 'name' attribute.
//   // The LoginForm component renders: <input name="email" ... />
//   const emailInput = await driver.wait(
//     until.elementLocated(By.name("email")),
//     WAIT_TIMEOUT
//   );

//   // Locate the password input by its HTML 'name' attribute.
//   // The LoginForm component renders: <input name="password" ... />
//   const passwordInput = await driver.wait(
//     until.elementLocated(By.name("password")),
//     WAIT_TIMEOUT
//   );

//   // Clear any pre-filled text (good practice even for fresh pages).
//   await emailInput.clear();
//   await passwordInput.clear();

//   // Type the email into the email field.
//   await emailInput.sendKeys(email);

//   // Type the password into the password field.
//   await passwordInput.sendKeys(password);
// }

// /**
//  * Clicks the submit button to attempt login.
//  *
//  * @param {WebDriver} driver
//  */
// async function submitLoginForm(driver) {
//   // The submit button is a <button type="submit"> inside the form.
//   // We locate it by CSS selector targeting the submit button's type attribute.
//   const submitButton = await driver.wait(
//     until.elementLocated(By.css("button[type='submit']")),
//     WAIT_TIMEOUT
//   );

//   // Ensure the button is visible and enabled before clicking.
//   await driver.wait(until.elementIsVisible(submitButton), WAIT_TIMEOUT);
//   await driver.wait(until.elementIsEnabled(submitButton), WAIT_TIMEOUT);

//   // Scroll the button into view to avoid ElementClickInterceptedError.
//   await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);

//   // Click the submit button.
//   await submitButton.click();
// }

// /**
//  * Retrieves the message displayed on the login form.
//  * Returns the text content of the message div, or an empty string if none.
//  */
// async function getFormMessage(driver) {
//   try {
//     // The message is rendered conditionally. It has dynamic classes but is inside
//     // a div with rounded-xl border. We use a CSS selector for the rounded border.
//     const messageDiv = await driver.findElement(
//       By.css("div.rounded-xl.border.px-4.py-3")
//     );
//     return await messageDiv.getText();
//   } catch (error) {
//     // If the element is not found, it means no message is displayed.
//     return "";
//   }
// }

// /**
//  * Waits until a URL matching the expected path is loaded.
//  */
// async function waitForUrl(driver, expectedPath) {
//   await driver.wait(
//     Condition.urlContains(expectedPath),
//     WAIT_TIMEOUT,
//     `Expected URL to contain "${expectedPath}"`
//   );
// }

// /**
//  * Creates a test user by calling the backend API directly.
//  * This avoids needing to interact with the registration page.
//  * Returns the created user object or null if it already existed.
//  */
// async function createTestUser() {
//   // We use Node's built-in https module to make a simple POST request
//   // without needing additional packages like axios.
//   const http = require("http");

//   const postData = JSON.stringify(TEST_USER);

//   const options = {
//     hostname: "localhost",
//     port: 8000,
//     path: "/api/v1/users/register",
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": Buffer.byteLength(postData),
//     },
//   };

//   return new Promise((resolve) => {
//     const req = http.request(options, (res) => {
//       let data = "";
//       res.on("data", (chunk) => (data += chunk));
//       res.on("end", () => {
//         try {
//           const json = JSON.parse(data);
//           resolve(json);
//         } catch {
//           resolve(null);
//         }
//       });
//     });

//     req.on("error", () => resolve(null));
//     req.write(postData);
//     req.end();
//   });
// }

// // ============================================================================
// // SECTION 4: TEST CASES
// // ============================================================================

// /**
//  * TEST 1: Successful Login
//  *
//  * Steps:
//  *   a. Open the login page.
//  *   b. Enter valid credentials.
//  *   c. Submit the form.
//  *   d. Verify redirect to the student dashboard.
//  *
//  * Pre-condition: A user must exist in the database matching TEST_USER.
//  *                createTestUser() will attempt to create one automatically.
//  */
// async function testSuccessfulLogin(driver) {
//   console.log("\n--- TEST: Successful Login ---");

//   // Step a: Open the login page and wait for it to load.
//   await openLoginPage(driver);
//   await waitForLoginPage(driver);
//   console.log("Login page loaded successfully.");

//   // Step b: Enter valid credentials into the form.
//   await fillLoginForm(driver, TEST_USER.email, TEST_USER.password);
//   console.log("Credentials entered.");

//   // Step c: Submit the form by clicking the Login button.
//   await submitLoginForm(driver);
//   console.log("Login form submitted.");

//   // Step d: Wait for the redirect and verify we land on the student dashboard.
//   // The login handler redirects: /dashboard/student for non-admin/teacher roles.
//   await waitForUrl(driver, "/dashboard/student");
//   console.log("Redirected to student dashboard successfully.");
// }

// /**
//  * TEST 2: Login with Invalid Email
//  *
//  * Verifies that submitting with a non-existent email shows an error message.
//  */
// async function testInvalidEmail(driver) {
//   console.log("\n--- TEST: Login with Invalid Email ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   // Enter an email that definitely does not exist in the database.
//   await fillLoginForm(driver, "nonexistent@example.com", "SomePassword123");
//   await submitLoginForm(driver);

//   // Wait for the error message to appear.
//   // The backend returns: "User does not exist" (404).
//   const message = await driver.wait(async () => {
//     const msg = await getFormMessage(driver);
//     return msg.length > 0 ? msg : null;
//   }, WAIT_TIMEOUT, "Expected an error message for invalid email");

//   console.log(`Error message received: "${message}"`);

//   // Verify the message indicates the user was not found.
//   if (!message.toLowerCase().includes("user does not exist")) {
//     throw new Error(
//       `Expected error about non-existent user, but got: "${message}"`
//     );
//   }
// }

// /**
//  * TEST 3: Login with Invalid Password
//  *
//  * Verifies that submitting with a valid email but wrong password shows an error.
//  */
// async function testInvalidPassword(driver) {
//   console.log("\n--- TEST: Login with Invalid Password ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   // Use the test user's email but with an incorrect password.
//   await fillLoginForm(driver, TEST_USER.email, "WrongPassword123!");
//   await submitLoginForm(driver);

//   // The backend returns: "Invalid user credentials" (401).
//   const message = await driver.wait(async () => {
//     const msg = await getFormMessage(driver);
//     return msg.length > 0 ? msg : null;
//   }, WAIT_TIMEOUT, "Expected an error message for invalid password");

//   console.log(`Error message received: "${message}"`);

//   if (!message.toLowerCase().includes("invalid user credentials")) {
//     throw new Error(
//       `Expected error about invalid credentials, but got: "${message}"`
//     );
//   }
// }

// /**
//  * TEST 4: Login with Empty Fields
//  *
//  * Verifies that the HTML5 'required' attribute prevents empty submission.
//  * Browsers show a built-in validation tooltip for required inputs.
//  */
// async function testEmptyFields(driver) {
//   console.log("\n--- TEST: Login with Empty Fields ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   // Do NOT enter any text. Just try to submit.
//   await submitLoginForm(driver);

//   // The browser's native validation should block the submission.
//   // We verify by checking that the URL has NOT changed.
//   const currentUrl = await driver.getCurrentUrl();
//   if (!currentUrl.includes("/login")) {
//     throw new Error(
//       "Form should not submit with empty fields, but URL changed."
//     );
//   }
//   console.log("Empty field validation works (submission blocked).");
// }

// /**
//  * TEST 5: Clear Button
//  *
//  * Verifies that the "Clear" button resets the form fields to empty.
//  */
// async function testClearButton(driver) {
//   console.log("\n--- TEST: Clear Button ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   // Fill the form with some data.
//   await fillLoginForm(driver, TEST_USER.email, TEST_USER.password);

//   // Click the Clear button (type="button", not submit).
//   const clearButton = await driver.wait(
//     until.elementLocated(By.css("button[type='button']")),
//     WAIT_TIMEOUT
//   );
//   await clearButton.click();

//   // Verify both fields are cleared.
//   const emailInput = await driver.findElement(By.name("email"));
//   const passwordInput = await driver.findElement(By.name("password"));

//   const emailValue = await emailInput.getAttribute("value");
//   const passwordValue = await passwordInput.getAttribute("value");

//   if (emailValue !== "" || passwordValue !== "") {
//     throw new Error(
//       `Clear button did not work. Email: "${emailValue}", Password: "${passwordValue}"`
//     );
//   }
//   console.log("Clear button reset the form successfully.");
// }

// /**
//  * TEST 6: Password Visibility Toggle
//  *
//  * Verifies that clicking the eye icon toggles the password field between
//  * 'password' and 'text' types.
//  */
// async function testPasswordVisibilityToggle(driver) {
//   console.log("\n--- TEST: Password Visibility Toggle ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   const passwordInput = await driver.findElement(By.name("password"));

//   // Initially, the input type should be 'password'.
//   let inputType = await passwordInput.getAttribute("type");
//   if (inputType !== "password") {
//     throw new Error(`Expected initial type "password", got "${inputType}"`);
//   }

//   // Click the visibility toggle button (the eye icon button).
//   // It is located inside a div with class 'relative', sibling to the input.
//   const toggleButton = await passwordInput.findElement(
//     By.xpath("./following-sibling::button")
//   );
//   await toggleButton.click();

//   // After clicking, the type should change to 'text'.
//   inputType = await passwordInput.getAttribute("type");
//   if (inputType !== "text") {
//     throw new Error(
//       `Expected type "text" after toggle, got "${inputType}"`
//     );
//   }

//   // Click again to toggle back to 'password'.
//   await toggleButton.click();
//   inputType = await passwordInput.getAttribute("type");
//   if (inputType !== "password") {
//     throw new Error(
//       `Expected type "password" after second toggle, got "${inputType}"`
//     );
//   }

//   console.log("Password visibility toggle works correctly.");
// }

// /**
//  * TEST 7: Navigation Links on Login Page
//  *
//  * Verifies that "Forgot password?" and "Sign up" links navigate to the
//  * correct pages.
//  */
// async function testNavigationLinks(driver) {
//   console.log("\n--- TEST: Navigation Links ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   // Test "Forgot password?" link.
//   const forgotLink = await driver.wait(
//     until.elementLocated(By.linkText("Forgot password?")),
//     WAIT_TIMEOUT
//   );
//   await forgotLink.click();
//   await waitForUrl(driver, "/forgot-password");
//   console.log("Forgot password link works.");

//   // Navigate back to login.
//   await driver.navigate().back();
//   await waitForLoginPage(driver);

//   // Test "Sign up" link.
//   const signUpLink = await driver.wait(
//     until.elementLocated(By.linkText("Sign up")),
//     WAIT_TIMEOUT
//   );
//   await signUpLink.click();
//   await waitForUrl(driver, "/register");
//   console.log("Sign up link works.");
// }

// /**
//  * TEST 8: Back Button
//  *
//  * Verifies that clicking the Back button triggers browser back navigation.
//  */
// async function testBackButton(driver) {
//   console.log("\n--- TEST: Back Button ---");

//   // Navigate to login from another page so back() has somewhere to go.
//   await driver.get(`${BASE_URL}/register`);
//   await driver.navigate().to(`${BASE_URL}/login`);
//   await waitForLoginPage(driver);

//   // Click the Back button.
//   const backButton = await driver.wait(
//     until.elementLocated(By.css("button")),
//     WAIT_TIMEOUT
//   );
//   // There are two buttons on the login page: Clear and Login.
//   // The Back button is in a separate BackButton component above the form.
//   // We locate it by its text content "Back".
//   const buttons = await driver.findElements(By.css("button"));
//   let backBtnFound = false;

//   for (const btn of buttons) {
//     const text = await btn.getText();
//     if (text.includes("Back")) {
//       await btn.click();
//       backBtnFound = true;
//       break;
//     }
//   }

//   if (!backBtnFound) {
//     throw new Error("Back button not found on the page.");
//   }

//   // After clicking back, we should return to the previous page.
//   // Because we came from /register, we expect to be on /register now.
//   await driver.wait(
//     Condition.urlContains("/register"),
//     WAIT_TIMEOUT,
//     "Expected to navigate back to /register"
//   );
//   console.log("Back button works correctly.");
// }

// /**
//  * TEST 9: Loading State
//  *
//  * Verifies that the Login button shows "Logging in..." during submission
//  * and is disabled.
//  */
// async function testLoadingState(driver) {
//   console.log("\n--- TEST: Loading State ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   // Fill the form with invalid data so the request takes a moment to fail.
//   await fillLoginForm(driver, TEST_USER.email, "WrongPassword123!");

//   // Submit and immediately check the button state.
//   await submitLoginForm(driver);

//   // Wait briefly for the loading state to appear.
//   const submitButton = await driver.findElement(
//     By.css("button[type='submit']")
//   );

//   // The button text should change to "Logging in..." and it should be disabled.
//   await driver.wait(async () => {
//     const text = await submitButton.getText();
//     const isDisabled = await submitButton.isEnabled();
//     return text === "Logging in..." && isDisabled === false;
//   }, 5000);

//   console.log("Loading state displayed correctly during login.");
// }

// /**
//  * TEST 10: Page Elements Presence
//  *
//  * Verifies that all expected UI elements are present on the login page.
//  * This acts as a sanity check for the page layout.
//  */
// async function testPageElementsPresence(driver) {
//   console.log("\n--- TEST: Page Elements Presence ---");

//   await openLoginPage(driver);
//   await waitForLoginPage(driver);

//   // Verify the heading.
//   const heading = await driver.findElement(By.css("h1"));
//   if ((await heading.getText()) !== "Login") {
//     throw new Error("Login heading not found.");
//   }

//   // Verify email input.
//   const emailInput = await driver.findElement(By.name("email"));
//   if ((await emailInput.getAttribute("type")) !== "email") {
//     throw new Error("Email input not found or wrong type.");
//   }

//   // Verify password input.
//   const passwordInput = await driver.findElement(By.name("password"));
//   if ((await passwordInput.getAttribute("type")) !== "password") {
//     throw new Error("Password input not found or wrong type.");
//   }

//   // Verify Clear button exists.
//   const clearButton = await driver.findElement(
//     By.xpath("//button[contains(text(), 'Clear')]")
//   );
//   if (!clearButton) {
//     throw new Error("Clear button not found.");
//   }

//   // Verify Login submit button exists.
//   const loginButton = await driver.findElement(
//     By.xpath("//button[contains(text(), 'Login')]")
//   );
//   if (!loginButton) {
//     throw new Error("Login button not found.");
//   }

//   // Verify Forgot password link exists.
//   const forgotLink = await driver.findElement(By.linkText("Forgot password?"));
//   if (!forgotLink) {
//     throw new Error("Forgot password link not found.");
//   }

//   // Verify Sign up link exists.
//   const signUpLink = await driver.findElement(By.linkText("Sign up"));
//   if (!signUpLink) {
//     throw new Error("Sign up link not found.");
//   }

//   // Verify password visibility toggle button exists.
//   const toggleBtn = await passwordInput.findElement(
//     By.xpath("./following-sibling::button")
//   );
//   if (!toggleBtn) {
//     throw new Error("Password visibility toggle not found.");
//   }

//   console.log("All expected page elements are present.");
// }

// // ============================================================================
// // SECTION 5: TEST RUNNER
// // ============================================================================

// /**
//  * Main test runner.
//  * Creates a driver, runs all tests in sequence, and quits the driver at the end.
//  */
// async function runTests() {
//   let driver;

//   try {
//     // Create the browser driver instance.
//     driver = await createDriver();

//     console.log("========================================");
//     console.log(" LMS Login Automation Tests");
//     console.log("========================================");

//     // Attempt to create a test user via the API before running tests.
//     // This ensures the valid login test has a user to authenticate with.
//     console.log("\nAttempting to create test user via API...");
//     const apiResponse = await createTestUser();

//     if (apiResponse && apiResponse.success) {
//       console.log("Test user created successfully via API.");
//     } else if (
//       apiResponse &&
//       apiResponse.data &&
//       apiResponse.data.message &&
//       apiResponse.data.message.toLowerCase().includes("already exists")
//     ) {
//       console.log("Test user already exists in the database.");
//     } else {
//       console.log(
//         "Warning: Could not create test user via API. " +
//           "Ensure the backend is running on port 8000. " +
//           "Valid login test may fail without a seeded user."
//       );
//     }

//     // Run each test sequentially.
//     // We run tests in a specific order so that successful login happens
//     // after the user is confirmed to exist.

//     await testPageElementsPresence(driver);

//     await testEmptyFields(driver);

//     await testInvalidEmail(driver);

//     await testInvalidPassword(driver);

//     await testClearButton(driver);

//     await testPasswordVisibilityToggle(driver);

//     await testNavigationLinks(driver);

//     await testBackButton(driver);

//     await testLoadingState(driver);

//     await testSuccessfulLogin(driver);

//     console.log("\n========================================");
//     console.log(" All tests completed!");
//     console.log("========================================");
//   } catch (error) {
//     console.error("\n========================================");
//     console.error(" TEST FAILED!");
//     console.error("========================================");
//     console.error(error.message);
//     console.error(error.stack);

//     // Take a screenshot on failure for debugging.
//     if (driver && driver.takeScreenshot) {
//       try {
//         const screenshot = await driver.takeScreenshot();
//         const fs = require("fs");
//         fs.writeFileSync("login-test-failure.png", screenshot, "base64");
//         console.error("Screenshot saved to: login-test-failure.png");
//       } catch (screenshotError) {
//         console.error("Could not take screenshot:", screenshotError.message);
//       }
//     }

//     process.exitCode = 1;
//   } finally {
//     // Always quit the driver to close the browser and free resources.
//     if (driver) {
//       await driver.quit();
//       console.log("\nBrowser closed.");
//     }
//   }
// }

// // Execute the test runner.
// runTests();
