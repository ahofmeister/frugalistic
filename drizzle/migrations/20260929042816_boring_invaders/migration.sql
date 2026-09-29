DROP VIEW "transaction_auto_suggest";--> statement-breakpoint
CREATE VIEW "transaction_auto_suggest" WITH (security_invoker = true) AS (WITH category_counts AS (
		SELECT TRIM(BOTH FROM t_1.description) AS description,
		       t_1.type,
		       t_1.account_id,
		       c.id AS category,
		       c.name,
		       c.color,
		       count(*) AS frequency,
		       row_number() OVER (PARTITION BY t_1.account_id, TRIM(BOTH FROM t_1.description), t_1.type ORDER BY count(*) DESC) AS rn
		FROM transactions t_1
				 JOIN categories c ON c.id = t_1.category_id AND c.account_id = t_1.account_id
		GROUP BY t_1.account_id, TRIM(BOTH FROM t_1.description), t_1.type, c.id, c.name, c.color
	),
	             totals AS (
					 SELECT account_id, description, type, sum(frequency) AS total_frequency
		             FROM category_counts
		             GROUP BY account_id, description, type
				 )
	        SELECT row_number() OVER (ORDER BY t.total_frequency DESC, cc.description) AS unique_id,
				cc.account_id,
		           cc.description,
		           cc.type,
		           cc.category,
		           cc.name,
		           cc.color,
		           t.total_frequency AS frequency
	        FROM category_counts cc
					 JOIN totals t ON cc.account_id = t.account_id AND cc.description = t.description AND cc.type = t.type
	        WHERE cc.rn = 1
	        ORDER BY t.total_frequency DESC, cc.description);