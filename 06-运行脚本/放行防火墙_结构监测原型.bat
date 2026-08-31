@echo off
REM 以管理员身份运行：右键本文件 -> 以管理员身份运行
REM 作用：放行 Axhub 结构监测原型开发栈的局域网访问端口（51720 vite + 53817 make-server）

echo 正在放行 Axhub 结构监测原型端口（51720 / 53817）...

REM 先删除可能存在的同名旧规则，避免重复堆叠
netsh advfirewall firewall delete rule name="Axhub-51720" >nul 2>&1
netsh advfirewall firewall delete rule name="Axhub-53817" >nul 2>&1

netsh advfirewall firewall add rule name="Axhub-51720" dir=in action=allow protocol=TCP localport=51720
netsh advfirewall firewall add rule name="Axhub-53817" dir=in action=allow protocol=TCP localport=53817

echo.
echo 完成。已添加两条入站规则：
echo   Axhub-51720  (TCP 51720  vite 渲染)
echo   Axhub-53817  (TCP 53817  make-server)
echo.
echo 同网段同事访问地址（把 IP 换成你本机局域网 IPv4，例如 172.16.41.48）：
echo   渲染: http://172.16.41.48:51720/?projectId=结构监测^&p=^<原型id^>
echo   管理: http://172.16.41.48:53817/?projectId=结构监测^&p=^<原型id^>
echo.
pause
