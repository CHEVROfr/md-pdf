# MD-PDF
MD-PDF, a Markdown to pdf converter from CHEVRO

## Installation

    git clone https://github.com/CHEVROfr/md-pdf.git

    npm install

## Deployment instructions

### Systemctl service:
Launch the application with **systemctl**

    sed -i "s?^WorkingDirectory=.*?WorkingDirectory=$(pwd)?g" md_pdf.service

    sudo cp md_pdf.service /etc/systemd/system/md_pdf.service

    sudo systemctl start md_pdf

### Caddy
Reverse proxy with **Caddy**:
Assuming your **Caddyfile** is located here: `/etc/caddy/Caddyfile`,
Add `import * .caddy` to the top of your `Caddyfile`, then run the following commands:
    
    sudo cp md_pdf.caddy /etc/caddy/md_pdf.caddy

    sudo systemctl restart caddy

# Authors

    CESTOLIV - @cestoliv