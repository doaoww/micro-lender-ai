# Swift Credit Decision

AI MicroCredit — MVP
1. Идея проекта
AI MicroCredit — mobile-first PWA-приложение, которое демонстрирует процесс оценки заявки на микрокредит с использованием:

финансового анализа;
rule-based risk engine;
простого ML scoring;
fraud signals;
LLM Underwriter Agent;
объяснимого финального решения.
Пользователь входит в приложение под заранее подготовленным аккаунтом.

Для каждого тестового пользователя уже существует синтетическая финансовая история:

доходы;
расходы;
транзакции;
существующие кредиты;
просрочки;
кредитная нагрузка;
KYC;
fraud signals.
Пользователь нажимает:

Check my eligibility
Система автоматически проводит полный анализ:

Application
    ↓
Financial Analysis
    ↓
Risk Engine
    ↓
Fraud Analysis
    ↓
ML Risk Score
    ↓
LLM Underwriter
    ↓
Decision
После анализа пользователь получает результат:

Approved
или:

Declined
с понятным объяснением причин.

3. Формат приложения

Приложение должно быть:

PWA;

mobile-first;

responsive;

хорошо выглядеть на смартфоне;

доступно также через desktop browser.

Интерфейс должен выглядеть как современное fintech-приложение.

Ориентиры:

Revolut;

Klarna;

modern banking apps;

Apple-style simplicity.

Главный принцип:

Пользователь не должен видеть сложность системы.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c9436ea2-a5d5-4964-b04a-c948fb7f1cd9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
