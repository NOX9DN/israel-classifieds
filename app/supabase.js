import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://nowfhkgolknvcciczwdt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vd2Zoa2dvbGtudmNjaWN6d2R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTkwOTcsImV4cCI6MjA4ODc5NTA5N30.itFln788XzffQON7rTzj6iY6YQPf4yhbJAhq3OZVsBQ'
)
```

Сохрани → потом:
```
git add .
git commit -m "fix supabase url"
git push