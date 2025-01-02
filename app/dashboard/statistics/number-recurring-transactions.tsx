import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export const NumberRecurringTransactions = async () => {
  const supabase = await createClient();

  const { count } = await supabase
    .from("transactions_recurring")
    .select("id", { count: "exact", head: true });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="text-xl">Recurring Transactions</div>
        </CardTitle>
      </CardHeader>
      <CardFooter>{count}</CardFooter>
    </Card>
  );
};
