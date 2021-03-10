@echo off
cls
goto main
:init
cls
echo ** Option Selected - main **
echo.
goto main
:main
echo Select a valid option:
echo.
echo 1) truffle commands
echo 2) yarn commands
echo 3) ganache-cli commands
echo 4) start development server
echo 5) start build server
echo.
choice /N /C:12345 /M "Option (1, 2, 3, 4 or 5):"%1
    if %errorlevel% == 1 goto truffle
    if %errorlevel% == 2 goto yarn
    if %errorlevel% == 3 goto ganache
    if %errorlevel% == 4 goto nDevelopment
    if %errorlevel% == 5 goto nBuildServe
:truffle
cls
echo ** Option Selected - truffle **
echo.
echo Select a valid option:
echo.
echo 1) Compile contracts
echo 2) Migrate contracts
echo 3) Test contracts
echo 4) Go to main menu
echo.
choice /N /C:1234 /M "Option (1, 2, 3 or 4):"%1
    if %errorlevel% == 1 goto cContracts
    if %errorlevel% == 2 goto mContracts
    if %errorlevel% == 3 goto tContracts
    if %errorlevel% == 4 goto init
    :cContracts
        cls
        truffle compile
    :mContracts
        cls
        truffle migrate
    :tContracts
        cls
        truffle test
:yarn
cd src
cls
echo ** Option Selected - yarn **
echo.
echo Select a valid option:
echo.
echo 1) yarn start
echo 2) yarn build
echo 3) yarn test
echo 4) yarn serve
echo 5) yarn build-and-serve
echo 6) yarn development
echo 7) Update browserslist
echo 8) Go to main menu
echo.
choice /N /C:12345678 /M "Option (1, 2, 3, 4, 5, 6, 7 or 8):"%1
    if %errorlevel% == 1 goto nStart
    if %errorlevel% == 2 goto nBuild
    if %errorlevel% == 3 goto nTest
    if %errorlevel% == 4 goto nServe
    if %errorlevel% == 5 goto nBuildServe
    if %errorlevel% == 6 goto nDevelopment
    if %errorlevel% == 7 goto browserslist
    if %errorlevel% == 8 goto init
    :nStart
        cls
        yarn start
    :nBuild
        cls
        yarn build
    :nTest
        cls
        yarn test
    :nServe
        cls
        yarn serve
    :nBuildServe
        cls
        yarn build-and-serve
    :nDevelopment
        cls
        yarn development
    :browserslist
        cls
        npx browserslist --update-db
:ganache
    cd src
    cls
    echo ** Option Selected - ganache-cli **
    echo.
    echo Select a valid option:
    echo.
    echo 1) run test blockchain
    echo 2) run build blockchain
    echo 3) Go to main menu
    echo.
    choice /N /C:123 /M "Option (1, 2 or 3):"%1
        if %errorlevel% == 1 goto tBlockchain
        if %errorlevel% == 2 goto bBlockchain
        if %errorlevel% == 3 goto init
    :tBlockchain
        cls
        yarn run ganache-cli --secure -u 0 --accounts 1 --defaultBalanceEther 999999999999999 --port 8545
    :bBlockchain
        cls
        yarn run ganache-cli --secure -u 0 --accounts 1 --defaultBalanceEther 999999999999999 --port 8268 --db ./blockchain