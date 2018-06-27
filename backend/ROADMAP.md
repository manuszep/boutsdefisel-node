# Roadmap

- Article model
- Document model
  - Upload document
  - Store path
  - Store metadata
- FAQ
- Stats
- Add CSRF token support to protect forms
- Add cron task to cleanup uploads
  - For each model with an upload field, fetch all rows that contain a path to a file
  - Compare that with the contents of public/uploads
  - Delete all files that have no refs in database