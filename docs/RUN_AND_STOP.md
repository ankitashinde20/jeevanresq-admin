# Run and Stop Local Hosting

## Run Backend

```powershell
cd D:\FlutterProjects\jeevan_resq\admin-web\backend
npm.cmd run start
```

Backend URL:

```text
http://localhost:8080
```

## Run Frontend

Open a second terminal:

```powershell
cd D:\FlutterProjects\jeevan_resq\admin-web\frontend
npm.cmd run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Frontend URL:

```text
http://localhost:5173/login
```

## Stop Backend or Frontend

If you started them in visible terminals, press:

```text
Ctrl + C
```

If they are running in the background, stop by port:

```powershell
$pid8080 = (Get-NetTCPConnection -LocalPort 8080 -State Listen).OwningProcess
Stop-Process -Id $pid8080

$pid5173 = (Get-NetTCPConnection -LocalPort 5173 -State Listen).OwningProcess
Stop-Process -Id $pid5173
```

If permission is denied, run PowerShell as Administrator.

## Stop All Node Servers

Only use this when you do not need any other Node.js project running:

```powershell
Get-Process node | Stop-Process
```

## Flutter App Admin Sync URL

Android emulator default:

```text
http://10.0.2.2:8080/api
```

Windows/web/default desktop:

```text
http://127.0.0.1:8080/api
```

Physical phone on same Wi-Fi:

```powershell
flutter run --dart-define=JEEVAN_ADMIN_API=http://YOUR_PC_WIFI_IP:8080/api
```

Example:

```powershell
flutter run --dart-define=JEEVAN_ADMIN_API=http://192.168.1.15:8080/api
```

