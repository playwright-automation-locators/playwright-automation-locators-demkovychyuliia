import { test, expect, Page } from '@playwright/test';

export const registrationDialog = (page:Page) =>
    page.locator('.modal-registration');

test('REG-01-Open registration modal', async ({ page}) => {
    await page.goto('http://localhost');

    await page.locator('.user-profile').click();

    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();
    await expect(registrationDialog(page)).toBeVisible();

    await expect(
        registrationDialog(page).getByRole('heading', {name: 'Реєстрація'})
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByRole('radio', {name: 'Відвідувач'})
    ).toBeChecked();

    await expect(
        registrationDialog(page).getByRole('radio', {name: 'Керівник'})
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByLabel('Прізвище')
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByLabel("Ім'я")
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByLabel('Телефон')
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByLabel('Email')
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByLabel('Пароль')
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByLabel('Підтвердження паролю')
    ).toHaveCount(1);

    await expect(
        registrationDialog(page).getByRole('button', {name: 'Зареєструватися'})
    ).toHaveCount(1);
});

test('REG-02-Submit button disabled on empty form', async ({ page}) => {
    await page.goto('http://localhost');

    await page.locator('.user-profile').click();

    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();

    await expect(
        registrationDialog(page).getByRole('button', {name: 'Зареєструватися'})
    ).toBeDisabled();
});

test('REG-03-Successful registration', async ({ page}) => {
    await page.goto('http://localhost');

    await page.locator('.user-profile').click();

    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();

    await expect(registrationDialog(page)).toBeVisible();

    const email = `test${Date.now()}@example.com`;
    
    await registrationDialog(page)
      .getByLabel('Прізвище')
      .fill('Шевченко');

    await registrationDialog(page)
      .getByLabel("Ім'я")
      .fill('Тарас');

    await registrationDialog(page)
      .getByLabel('Телефон')
      .fill('0501234567');

    await registrationDialog(page)
      .getByLabel('Email')
      .fill(email);
    
    await registrationDialog(page)
      .getByLabel('Пароль')
      .fill('Test123!');

    await registrationDialog(page)
      .getByLabel('Підтвердження паролю')
      .fill('Test123!');

    await registrationDialog(page)
      .getByRole('button', {name: 'Зареєструватися'})
      .click();

    await expect(
        page.getByText(/зареєструвалися/i)
    ).toBeVisible(); 

    await expect(
        page.getByText(/лист.*підтвердження/i)
    ).toBeVisible(); 
    
    await expect (registrationDialog(page)).not.toBeVisible();

    await page.locator('.user-profile').click();

    await expect(
        page.getByRole('menuitem', { name: 'Зареєструватися' })
    ).toBeVisible();
    
    await expect(
        page.getByRole('menuitem', { name: 'Увійти' })
    ).toBeVisible();
    
    });

test('REG-04-Client-side field validation', async ({ page}) => {
    await page.goto('http://localhost');
    
    await page.locator('.user-profile').click();
    
    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();
    
    await expect(registrationDialog(page)).toBeVisible();

    const emailInput = registrationDialog(page).getByLabel('Email');

    const phoneInput = registrationDialog(page).getByLabel('Телефон');

    const passwordInput = registrationDialog(page).getByLabel('Пароль');

    const registrationButton = registrationDialog(page).getByRole('button', {
        name: 'Зареєструватися',
    });
    await registrationDialog(page)
      .getByLabel('Прізвище')
      .fill('Шевченко');

      await registrationDialog(page)
      .getByLabel("Ім'я")
      .fill('Тарас');

    await phoneInput.fill('0501234567');

    await emailInput.fill('testvalidation@example.com');

    await passwordInput.fill('Test123!');

    await registrationDialog(page)
    .getByLabel('Підтвердження паролю')
    .fill('Test123!');

    //Invalid email
    await emailInput.fill('bad');

    await expect(
        registrationDialog(page).getByText(/Некоректний формат email/i)
    ).toBeVisible();

    await expect(registrationButton).toBeDisabled();

    //Invalid phone
    await emailInput.fill('testvalidation@example.com');
    await phoneInput.fill('501234567');

    await expect(
        registrationDialog(page).getByText(/10 цифр/i)
    ).toBeVisible();

    await expect(
        registrationDialog(page).getByText(/українському формату/i)
    ).toBeVisible();

    await expect(registrationButton).toBeDisabled();

    //Invalid password
    await phoneInput.fill('0501234567');
    await passwordInput.fill('short1!');

    await expect(
        registrationDialog(page).getByText(/від 8 до 20 символів/i)
    ).toBeVisible();

    await expect(registrationButton).toBeDisabled();
    });

test('REG-05-Password confirmation mismatch', async ({ page}) => {
    await page.goto('http://localhost');
        
    await page.locator('.user-profile').click();
        
    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();
        
    await expect(registrationDialog(page)).toBeVisible();

    const emailInput = registrationDialog(page).getByLabel('Email');

    const phoneInput = registrationDialog(page).getByLabel('Телефон');

    const passwordInput = registrationDialog(page).getByLabel('Пароль');

    const confirmationPasswordInput = registrationDialog(page).getByLabel('Підтвердження паролю');

    const registrationButton = registrationDialog(page).getByRole('button', {
        name: 'Зареєструватися'
    });
    const email = `test${Date.now()}@example.com`;  

    await registrationDialog(page)
      .getByLabel('Прізвище')
      .fill('Шевченко');

      await registrationDialog(page)
      .getByLabel("Ім'я")
      .fill('Тарас');

    await phoneInput.fill('0501234567');

    await emailInput.fill(email);

    await passwordInput.fill('Test123!');
    
    await confirmationPasswordInput.fill('Test1234!');
    
    await confirmationPasswordInput.press('Tab');

    await expect(
        registrationDialog(page).getByText('Паролі не збігаються')
    ).toBeVisible();

    await expect(registrationButton).toBeDisabled();

    });

test('REG-06-Registration with Manager role', async ({ page}) => {
    await page.goto('http://localhost');
    
    await page.locator('.user-profile').click();
    
    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();
    
    await expect(registrationDialog(page)).toBeVisible();

    const managerRole = registrationDialog(page).getByText('Керівник', {
        exact: true,
    });
    const email = `test${Date.now()}@example.com`;  
    const registrationButton = registrationDialog(page).getByRole('button', {
        name: 'Зареєструватися',
    });

    
    await managerRole.click();
    await expect(
        registrationDialog(page).getByRole('radio', { name: 'Керівник'})
    ).toBeChecked();
    
    
    await registrationDialog(page)
      .getByLabel('Прізвище')
      .fill('Шевченко');

      await registrationDialog(page)
      .getByLabel("Ім'я")
      .fill('Тарас');

      await registrationDialog(page)
      .getByLabel('Телефон')
      .fill('0501234567');

    await registrationDialog(page)
      .getByLabel('Email')
      .fill(email);
    
    await registrationDialog(page)
      .getByLabel('Пароль')
      .fill('Test123!');

    await registrationDialog(page)
      .getByLabel('Підтвердження паролю')
      .fill('Test123!');

      
      await registrationButton.click();

      await expect(
        page.getByText(/зареєструвалися/i)
    ).toBeVisible(); 

    await expect(registrationDialog(page)).not.toBeVisible();

    });

test('REG-07-Duplicate email error', async ({ page}) => {
    await page.goto('http://localhost');
        
    await page.locator('.user-profile').click();
        
    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();
        
    await expect(registrationDialog(page)).toBeVisible();

    const registrationButton = registrationDialog(page).getByRole('button', {
        name: 'Зареєструватися',
    });

    const email = 'test1@example.com';

    await registrationDialog(page)
      .getByLabel('Прізвище')
      .fill('Шевченко');

    await registrationDialog(page)
      .getByLabel("Ім'я")
      .fill('Тарас');

    await registrationDialog(page)
      .getByLabel('Телефон')
      .fill('0501234567');

    await registrationDialog(page)
      .getByLabel('Email')
      .fill(email);
    
    await registrationDialog(page)
      .getByLabel('Пароль')
      .fill('Test123!');

    await registrationDialog(page)
      .getByLabel('Підтвердження паролю')
      .fill('Test123!');

    await registrationButton.click();

    await expect(
        page.getByText(/duplicate key value violates unique constraint/i)
    ).toBeVisible();

    await expect(registrationDialog(page)).toBeVisible();

      
});
    
test('REG-08-OAuth registration links', async ({ page}) => {
    await page.goto('http://localhost');
        
    await page.locator('.user-profile').click();
        
    await page.getByRole('menuitem', { name: 'Зареєструватися' }).click();
        
    await expect(registrationDialog(page)).toBeVisible();

    const googleLink = registrationDialog(page).getByRole('link',{
        name: 'Реєстрація через Google'
    });

    const facebookLink = registrationDialog(page).getByRole('link',{
        name: 'Реєстрація через Facebook'
    });

    await expect(googleLink).toHaveCount(1);
    await expect(facebookLink).toHaveCount(1);

    await expect(googleLink).toBeVisible();
    await expect(facebookLink).toBeVisible();

    await expect(googleLink).toHaveAttribute('href', /role=ROLE_USER/);
    await expect(facebookLink).toHaveAttribute('href', /role=ROLE_USER/);

    await registrationDialog(page)
    .getByText('Керівник', { exact: true})
    .click();

    await expect(googleLink).toHaveAttribute('href', /role=ROLE_MANAGER/);
    await expect(facebookLink).toHaveAttribute('href', /role=ROLE_MANAGER/);

});






















    













