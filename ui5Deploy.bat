@echo off
powershell -Command $pword = read-host "Enter password" -AsSecureString ; ^
    $BSTR=[System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pword) ; ^
        [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR) > .tmp.txt
set /p password=<.tmp.txt & del .tmp.txt
grunt deploy --pwd=%password%
