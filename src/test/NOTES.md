1. HOC call creates a new component type, if you call it inside another component's render, every render produces a different type. React unmounts the old page and mounts a new one.Creating wrapper at module level, gives React a stable component identity.


2. withLoading accepts wrapped component props plus isloading, inside the HOC, it removes isLoading before spreading rest into the wrapped comp. 
So the types describe the extra prop, but the destructuring is what actually prevents it from reaching the component at runtime. The rest as P cast tells TypeScript the remaining props match P; it does not itself remove anything.

3. When a signed-out user requests a protected page, withAuth redirects them to login and puts the restricted location in navigation state
login reads location state from pathname if no saved pages it uses /dashboard
after mock api accepts username login saves user session and navigates to the pathname with replace:true
replacing login history entry means Back won't immediatly return to login form.

4. I’d preserve the full requested URL after login, including its query string and hash. Right now Login restores only the pathname, so a link to a filtered project list opens without its filters after sign-in.
