const { exec } = require('child_process');
const os = require('os');

exec('clangd --version', (error) => {
    if (error) {
        console.log('clangd is not installed. Installing...');

        let installCommand;
        switch (os.platform()) {
            case 'darwin': // macOS
                installCommand = 'brew install llvm';
                break;
            case 'linux': // Linux
                installCommand = 'sudo apt install clangd';
                break;
            case 'win32': // Windows
                installCommand = 'choco install llvm';
                break;
            default:
                console.log('Unsupported OS. Please install clangd manually.');
                return;
        }

        exec(installCommand, (installError) => {
            if (installError) {
                console.error(`Failed to install clangd: ${installError.message}`);
            } else {
                console.log('clangd installed successfully.');
            }
        });
    } else {
        console.log('clangd is installed.');
    }
});
