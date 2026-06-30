import os

files_to_remove = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'src/main.tsx',
    'src/App.tsx',
    'src/models/User.ts',
    'src/models/Task.ts',
    'src/services/StorageService.ts',
    'src/services/AuthService.ts',
    'src/services/TaskService.ts',
    'src/services/ReportService.ts',
    'src/services/PdfExporter.ts',
    'src/components/LoginForm.tsx',
    'src/components/TaskCard.tsx',
    'src/components/TaskModal.tsx',
    'src/components/ReportsPanel.tsx',
    'src/components/Dashboard.tsx'
]

for f in files_to_remove:
    if os.path.exists(f):
        try:
            os.remove(f)
            print(f"Removed: {f}")
        except Exception as e:
            print(f"Failed to remove {f}: {e}")
