@echo off
echo [INFO] Configurando ambiente para Build Android (Expo)...

:: 1. Definir o JAVA_HOME para o JDK 17 (Ajuste o caminho se necessario)
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

:: 2. Definir o ANDROID_HOME (Geralmente ja esta no sistema, mas garante aqui)
if "%ANDROID_HOME%"=="" (
    set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
)
set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"

echo [INFO] Versao do Java ativa nesta sessao:
java -version

echo.
echo [INFO] Limpando cache do Gradle antes de iniciar...
cd android
call gradlew clean
cd ..

echo.
echo [INFO] Iniciando build no Android...
npx expo run:android