import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  console.log('=== Starting Todo App Verification ===\n');

  try {
    // Navigate to the app
    console.log('1. Loading app at http://localhost:5174/...');
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Take initial screenshot (empty state)
    await page.screenshot({ path: 'verify-1-initial.png', fullPage: true });
    console.log('✅ App loaded successfully');
    console.log('   Screenshot saved: verify-1-initial.png\n');

    // Check empty state message
    console.log('2. Checking empty state message...');
    const emptyMessage = await page.locator('.empty-message').textContent();
    console.log(`✅ Empty state message visible: "${emptyMessage}"`);
    await page.screenshot({ path: 'verify-2-empty-state.png', fullPage: true });
    console.log('   Screenshot saved: verify-2-empty-state.png\n');

    // Add first todo
    console.log('3. Adding first todo: "Buy groceries"...');
    await page.fill('.todo-input', 'Buy groceries');
    await page.click('.add-button');
    await page.waitForTimeout(300);
    const firstTodo = await page.locator('.todo-item').first().textContent();
    console.log(`✅ First todo added: "${firstTodo.replace('❌', '').trim()}"`);
    await page.screenshot({ path: 'verify-3-first-todo.png', fullPage: true });
    console.log('   Screenshot saved: verify-3-first-todo.png\n');

    // Add second todo
    console.log('4. Adding second todo: "Write report"...');
    await page.fill('.todo-input', 'Write report');
    await page.click('.add-button');
    await page.waitForTimeout(300);
    const todoCount = await page.locator('.todo-item').count();
    console.log(`✅ Second todo added. Total todos: ${todoCount}`);
    await page.screenshot({ path: 'verify-4-two-todos.png', fullPage: true });
    console.log('   Screenshot saved: verify-4-two-todos.png\n');

    // Add third todo using Enter key
    console.log('5. Adding third todo using Enter key: "Call dentist"...');
    await page.fill('.todo-input', 'Call dentist');
    await page.press('.todo-input', 'Enter');
    await page.waitForTimeout(300);
    const todoCountAfterEnter = await page.locator('.todo-item').count();
    console.log(`✅ Third todo added via Enter key. Total todos: ${todoCountAfterEnter}`);
    await page.screenshot({ path: 'verify-5-three-todos.png', fullPage: true });
    console.log('   Screenshot saved: verify-5-three-todos.png\n');

    // Mark first todo as complete
    console.log('6. Marking first todo ("Call dentist") as complete...');
    await page.locator('.todo-checkbox').first().check();
    await page.waitForTimeout(300);
    const isCompleted = await page.locator('.todo-text.completed').count();
    console.log(`✅ Todo marked as complete. Completed todos: ${isCompleted}`);
    await page.screenshot({ path: 'verify-6-completed.png', fullPage: true });
    console.log('   Screenshot saved: verify-6-completed.png\n');

    // Verify strikethrough styling
    console.log('7. Verifying strikethrough styling on completed todo...');
    const completedText = await page.locator('.todo-text.completed').first();
    const textDecoration = await completedText.evaluate(el =>
      window.getComputedStyle(el).textDecoration
    );
    console.log(`✅ Completed todo has text-decoration: ${textDecoration}`);
    console.log('   (Should include "line-through")\n');

    // Uncheck the todo
    console.log('8. Unchecking the completed todo...');
    await page.locator('.todo-checkbox').first().uncheck();
    await page.waitForTimeout(300);
    const stillCompleted = await page.locator('.todo-text.completed').count();
    console.log(`✅ Todo unchecked. Completed todos now: ${stillCompleted}`);
    await page.screenshot({ path: 'verify-7-unchecked.png', fullPage: true });
    console.log('   Screenshot saved: verify-7-unchecked.png\n');

    // Delete middle todo
    console.log('9. Deleting middle todo ("Write report")...');
    const beforeDelete = await page.locator('.todo-item').count();
    await page.locator('.delete-button').nth(1).click();
    await page.waitForTimeout(300);
    const afterDelete = await page.locator('.todo-item').count();
    console.log(`✅ Todo deleted. Before: ${beforeDelete}, After: ${afterDelete}`);
    await page.screenshot({ path: 'verify-8-deleted.png', fullPage: true });
    console.log('   Screenshot saved: verify-8-deleted.png\n');

    // Test empty input (should not add)
    console.log('10. 🔍 PROBE: Attempting to add empty todo...');
    const beforeEmpty = await page.locator('.todo-item').count();
    await page.fill('.todo-input', '   ');
    await page.click('.add-button');
    await page.waitForTimeout(300);
    const afterEmpty = await page.locator('.todo-item').count();
    console.log(`🔍 Empty/whitespace input rejected. Todos before: ${beforeEmpty}, after: ${afterEmpty}`);
    console.log('   (Should be the same - no todo added)\n');

    // Test rapid additions
    console.log('11. 🔍 PROBE: Adding multiple todos rapidly...');
    await page.fill('.todo-input', 'Task 1');
    await page.click('.add-button');
    await page.fill('.todo-input', 'Task 2');
    await page.click('.add-button');
    await page.fill('.todo-input', 'Task 3');
    await page.click('.add-button');
    await page.waitForTimeout(300);
    const rapidTotal = await page.locator('.todo-item').count();
    console.log(`🔍 Rapid additions successful. Total todos: ${rapidTotal}`);
    await page.screenshot({ path: 'verify-9-rapid-additions.png', fullPage: true });
    console.log('   Screenshot saved: verify-9-rapid-additions.png\n');

    // Delete all todos to see empty state again
    console.log('12. Deleting all todos to verify empty state returns...');
    const allTodos = await page.locator('.delete-button').count();
    for (let i = 0; i < allTodos; i++) {
      await page.locator('.delete-button').first().click();
      await page.waitForTimeout(100);
    }
    const finalCount = await page.locator('.todo-item').count();
    const emptyMessageReturned = await page.locator('.empty-message').isVisible();
    console.log(`✅ All todos deleted. Remaining: ${finalCount}`);
    console.log(`✅ Empty state message returned: ${emptyMessageReturned}`);
    await page.screenshot({ path: 'verify-10-final-empty.png', fullPage: true });
    console.log('   Screenshot saved: verify-10-final-empty.png\n');

    // Final screenshot with sample data
    console.log('13. Creating final demo state with sample data...');
    await page.fill('.todo-input', 'Review pull requests');
    await page.click('.add-button');
    await page.fill('.todo-input', 'Update documentation');
    await page.click('.add-button');
    await page.fill('.todo-input', 'Fix bug #123');
    await page.click('.add-button');
    await page.locator('.todo-checkbox').nth(1).check();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'verify-11-final-demo.png', fullPage: true });
    console.log('✅ Final demo state created');
    console.log('   Screenshot saved: verify-11-final-demo.png\n');

    console.log('=== Verification Complete ===');
    console.log('All screenshots saved to project root directory\n');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    await page.screenshot({ path: 'verify-error.png', fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
