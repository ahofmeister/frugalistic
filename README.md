# Frugalistic

<p align="center">
Frugalistic is a modern financial management tool designed to help you track your expenses, incomes, and savings. With features like transaction categorization, recurring transaction tracking, and insightful analytics, Frugalistic empowers you to take control of your finances effortlessly.</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> 
</p>
<br/>

## Features

* Easy Transaction Tracking: Log incomes, expenses and savings incomes with ease

* Recurring Transactions: Automatically track monthly recurring expenses and incomes.

* Analytics Dashboard: View expenses, savings, and income by category, month, or year.

* Insights: Filter transactions by custom date ranges with shortcuts like "This Month" or "This Year".

* Autocomplete Descriptions: Avoid typos with intelligent autocomplete for transaction descriptions.

* (Not yet) Demo Mode: Explore the app with preloaded demo data.

## Demo

WIP

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone this repo

   ```bash
   git clone https://github.com/ahofmeister/frugalistic
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd frugalistic
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found
   in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

