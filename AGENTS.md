<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public entry and account forms in top-level routes and cabinet pages under the managed client-only authenticated layout; browser sessions cannot be checked during SSR.
- Store account names and handles in owner-scoped profiles created by an Auth lifecycle trigger; keep demonstration credit scenarios and payment state separate from durable accounts.
- Share cabinet presentation through microcredit components and validate demo search parameters centrally; all scenario pages must preserve amount, term and scenario.
