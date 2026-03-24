export type Difficulty = 'Iniciante' | 'Intermediário' | 'Avançado';
export type Phase = 'Inteligência' | 'Acesso' | 'Manutenção' | 'Limpeza e Relatório';

export interface Tool {
  id: number;
  name: string;
  category: string;
  difficulty: Difficulty;
  phase: Phase;
  strategy: string;
  command: string;
  proTip: string;
}

export const arsenalData: Tool[] = [
  // --- INICIANTE (15 Ferramentas) ---
  {
    id: 1, name: "Nmap", category: "Network Scanning", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Descobrir portas abertas, serviços rodando e o sistema operacional do alvo.",
    command: "nmap -sV -sC -T4 192.168.1.1",
    proTip: "Use '-oA nmap_scan' para salvar os resultados em todos os formatos (XML, Grepable, Normal) simultaneamente."
  },
  {
    id: 2, name: "Whois", category: "Footprinting", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Obter dados de registro de domínio, servidores DNS e contatos técnicos.",
    command: "whois example.com",
    proTip: "Combine com 'grep' para extrair apenas e-mails: whois example.com | grep -i email"
  },
  {
    id: 3, name: "Netcat (nc)", category: "Conectividade", difficulty: "Iniciante", phase: "Manutenção",
    strategy: "Criar conexões simples, transferir arquivos ou ouvir portas (o 'canivete suíço' do TCP/IP).",
    command: "nc -lvnp 4444",
    proTip: "Pode ser usado para banner grabbing simples: nc -nv 192.168.1.1 80"
  },
  {
    id: 4, name: "TheHarvester", category: "OSINT", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Coletar e-mails, subdomínios e IPs de fontes públicas (Google, LinkedIn, etc).",
    command: "theHarvester -d example.com -b google,linkedin",
    proTip: "Configure as chaves de API no arquivo api-keys.yaml para resultados muito mais profundos."
  },
  {
    id: 5, name: "Dig", category: "DNS Enumeration", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Consultar servidores DNS para descobrir registros (A, MX, TXT) e tentar transferência de zona.",
    command: "dig axfr @ns1.example.com example.com",
    proTip: "Use '+short' para obter apenas os IPs de resposta, ideal para scripts bash."
  },
  {
    id: 6, name: "Ping", category: "Network", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Verificar se um host está ativo na rede via ICMP echo requests.",
    command: "ping -c 4 192.168.1.1",
    proTip: "No Linux, o ping roda infinitamente. Sempre use '-c' em scripts para limitar a contagem."
  },
  {
    id: 7, name: "Traceroute", category: "Network", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Mapear o caminho (saltos de roteadores) que um pacote faz até o destino.",
    command: "traceroute example.com",
    proTip: "Se o ICMP estiver bloqueado, use 'traceroute -T' para usar pacotes TCP SYN."
  },
  {
    id: 8, name: "Curl", category: "Web Transfer", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Interagir com servidores web via linha de comando para testar APIs ou baixar payloads.",
    command: "curl -I http://example.com",
    proTip: "Use '-I' para ver apenas os cabeçalhos HTTP (Banner Grabbing) sem baixar o corpo da página."
  },
  {
    id: 9, name: "Wget", category: "Web Transfer", difficulty: "Iniciante", phase: "Acesso",
    strategy: "Baixar arquivos ou espelhar diretórios inteiros de servidores web.",
    command: "wget -m http://example.com",
    proTip: "Use '--no-check-certificate' ao baixar payloads de servidores HTTPS com certificados autoassinados."
  },
  {
    id: 10, name: "Macchanger", category: "Anonymity", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Alterar o endereço MAC da placa de rede para burlar filtros ou manter anonimato.",
    command: "macchanger -r eth0",
    proTip: "Sempre derrube a interface ('ifconfig eth0 down') antes de tentar mudar o MAC."
  },
  {
    id: 11, name: "ExifTool", category: "Forense", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Extrair metadados ocultos de arquivos (fotos, PDFs) que podem revelar usuários ou localizações.",
    command: "exiftool documento.pdf",
    proTip: "Arquivos PDF frequentemente vazam o nome de usuário do Windows do autor no campo 'Creator'."
  },
  {
    id: 12, name: "Recon-ng", category: "OSINT", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Framework completo de OSINT com interface similar ao Metasploit para coleta de dados.",
    command: "recon-ng",
    proTip: "Use o marketplace interno ('marketplace install all') para carregar todos os módulos de busca."
  },
  {
    id: 13, name: "Shodan", category: "OSINT", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Buscar dispositivos conectados à internet (IoT, webcams, roteadores) via CLI.",
    command: "shodan search 'port:21 Anonymous user logged in'",
    proTip: "Use 'shodan host [IP]' para ver todas as portas e vulnerabilidades conhecidas de um IP sem tocá-lo."
  },
  {
    id: 14, name: "Nslookup", category: "DNS Enumeration", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Consultar interativamente servidores DNS para resolver nomes ou IPs.",
    command: "nslookup -type=any example.com",
    proTip: "Pode ser usado no modo interativo digitando apenas 'nslookup' para múltiplas consultas."
  },
  {
    id: 15, name: "Maltego", category: "OSINT", difficulty: "Iniciante", phase: "Inteligência",
    strategy: "Mapear visualmente relacionamentos entre domínios, IPs, e-mails e pessoas.",
    command: "maltego",
    proTip: "A força do Maltego está nas 'Transforms'. Crie uma conta gratuita na Paterva para usar as Transforms da CE."
  },

  // --- INTERMEDIÁRIO (20 Ferramentas) ---
  {
    id: 16, name: "Metasploit", category: "Exploitation", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Automatizar a execução de exploits contra falhas conhecidas e gerenciar sessões.",
    command: "msfconsole -q",
    proTip: "Use 'workspace' para separar dados de diferentes clientes/projetos dentro do banco de dados do MSF."
  },
  {
    id: 17, name: "Burp Suite", category: "Web Proxy", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Interceptar e modificar requisições HTTP/HTTPS entre o navegador e o servidor alvo.",
    command: "burpsuite",
    proTip: "O 'Intruder' do Burp é excelente para fuzzing de APIs e brute force de formulários web."
  },
  {
    id: 18, name: "SQLmap", category: "Web Attacks", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Detectar e explorar vulnerabilidades de Injeção de SQL (SQLi) automaticamente.",
    command: "sqlmap -u 'http://alvo.com/page.php?id=1' --dbs",
    proTip: "Use '--os-shell' se o banco de dados for MySQL/MSSQL e tiver privilégios altos para ganhar RCE."
  },
  {
    id: 19, name: "Nikto", category: "Web Scanning", difficulty: "Intermediário", phase: "Inteligência",
    strategy: "Encontrar arquivos perigosos, versões desatualizadas e problemas de configuração em servidores web.",
    command: "nikto -h http://alvo.com",
    proTip: "Combine com o Nmap: exporte portas web do Nmap e passe para o Nikto para automação."
  },
  {
    id: 20, name: "Gobuster", category: "Web Enumeration", difficulty: "Intermediário", phase: "Inteligência",
    strategy: "Descobrir diretórios e arquivos ocultos em servidores web via força bruta rápida (escrito em Go).",
    command: "gobuster dir -u http://alvo.com -w /usr/share/wordlists/dirb/common.txt",
    proTip: "Use a flag '-x php,txt,html' para buscar extensões de arquivos específicas durante o scan."
  },
  {
    id: 21, name: "Dirb", category: "Web Enumeration", difficulty: "Intermediário", phase: "Inteligência",
    strategy: "Fuzzing clássico de diretórios web (alternativa mais antiga ao Gobuster).",
    command: "dirb http://alvo.com",
    proTip: "Útil quando você não quer instalar ferramentas em Go, pois já vem nativo em quase todo Kali."
  },
  {
    id: 22, name: "Wfuzz", category: "Web Fuzzing", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Fuzzing avançado de parâmetros GET/POST, cabeçalhos e cookies para achar vulnerabilidades.",
    command: "wfuzz -c -z file,wordlist.txt --hc 404 http://alvo.com/page.php?FUZZ=1",
    proTip: "A flag '--hc 404' esconde respostas 404. Use '--hw' para esconder respostas baseadas no número de palavras."
  },
  {
    id: 23, name: "WPScan", category: "Web Attacks", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Escanear sites WordPress em busca de plugins vulneráveis, temas e usuários.",
    command: "wpscan --url http://alvo.com --enumerate u",
    proTip: "Use '--api-token' com uma conta gratuita do WPVulnDB para ver os detalhes exatos das vulnerabilidades."
  },
  {
    id: 24, name: "Hydra", category: "Brute Force", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Realizar ataques de força bruta online contra serviços de login (SSH, FTP, HTTP, etc).",
    command: "hydra -l admin -P pass.txt ssh://192.168.1.100",
    proTip: "Cuidado com bloqueios de conta (lockout). Use '-t 4' para diminuir as threads e evitar detecção rápida."
  },
  {
    id: 25, name: "John the Ripper", category: "Password Cracking", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Quebrar hashes de senhas obtidos de bancos de dados ou arquivos /etc/shadow (cracking offline).",
    command: "john --wordlist=rockyou.txt hash.txt",
    proTip: "Use 'unshadow /etc/passwd /etc/shadow > unshadowed.txt' antes de passar para o John."
  },
  {
    id: 26, name: "Hashcat", category: "Password Cracking", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Cracking de senhas ultrarrápido utilizando o poder de processamento da GPU.",
    command: "hashcat -m 0 -a 0 hash.txt rockyou.txt",
    proTip: "O '-m' define o tipo de hash (0 = MD5, 1000 = NTLM). Sempre verifique o código do hash na documentação."
  },
  {
    id: 27, name: "Aircrack-ng", category: "Wireless", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Capturar pacotes e quebrar senhas de redes Wi-Fi (WEP/WPA/WPA2).",
    command: "aircrack-ng -w wordlist.txt capture.cap",
    proTip: "Você precisa capturar o '4-way handshake' com o airodump-ng antes de usar o aircrack-ng."
  },
  {
    id: 28, name: "Enum4linux", category: "SMB Enum", difficulty: "Intermediário", phase: "Inteligência",
    strategy: "Extrair informações de sistemas Windows e Samba (usuários, shares, políticas de senha).",
    command: "enum4linux -a 192.168.1.100",
    proTip: "A flag '-a' faz todos os testes simples. Excelente para CTFs e redes corporativas internas."
  },
  {
    id: 29, name: "SMBClient", category: "SMB Access", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Conectar-se a compartilhamentos de rede SMB/CIFS como se fosse um cliente FTP.",
    command: "smbclient -L \\\\192.168.1.100 -U ''",
    proTip: "O '-U ''' tenta um login de sessão nula (Null Session), que frequentemente revela shares públicos."
  },
  {
    id: 30, name: "Searchsploit", category: "Exploits", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Buscar exploits locais no banco de dados do Exploit-DB sem precisar de internet.",
    command: "searchsploit apache 2.4",
    proTip: "Use 'searchsploit -m [ID]' para copiar o exploit diretamente para o seu diretório atual."
  },
  {
    id: 31, name: "Nessus", category: "Vulnerability Scanner", difficulty: "Intermediário", phase: "Inteligência",
    strategy: "Escanear redes corporativas em busca de milhares de vulnerabilidades conhecidas e gerar relatórios.",
    command: "systemctl start nessusd",
    proTip: "Nessus não vem pré-instalado no Kali por ser comercial, mas a versão Essentials é gratuita para até 16 IPs."
  },
  {
    id: 32, name: "OpenVAS", category: "Vulnerability Scanner", difficulty: "Intermediário", phase: "Inteligência",
    strategy: "Alternativa open-source ao Nessus para varredura de vulnerabilidades em larga escala.",
    command: "gvm-start",
    proTip: "A atualização dos feeds (greenbone-nvt-sync) é demorada, faça-a antes de ir para o cliente."
  },
  {
    id: 33, name: "Responder", category: "Network Attacks", difficulty: "Intermediário", phase: "Acesso",
    strategy: "Envenenar protocolos LLMNR/NBT-NS no Windows para capturar hashes NTLMv2 na rede local.",
    command: "responder -I eth0 -rdw",
    proTip: "Deixe rodando de manhã cedo em redes corporativas quando os usuários estão ligando os PCs."
  },
  {
    id: 34, name: "Wireshark", category: "Sniffing", difficulty: "Intermediário", phase: "Limpeza e Relatório",
    strategy: "Analisar tráfego de rede em profundidade através de uma interface gráfica detalhada.",
    command: "wireshark",
    proTip: "Aprenda filtros de display (ex: 'http.request.method == POST') para achar credenciais rapidamente."
  },
  {
    id: 35, name: "Tcpdump", category: "Sniffing", difficulty: "Intermediário", phase: "Inteligência",
    strategy: "Capturar pacotes de rede via linha de comando (ideal para servidores sem interface gráfica).",
    command: "tcpdump -i eth0 -w captura.pcap",
    proTip: "Use '-A' para imprimir o conteúdo dos pacotes em ASCII (ótimo para ver tráfego HTTP em texto claro)."
  },

  // --- AVANÇADO (15 Ferramentas) ---
  {
    id: 36, name: "Mimikatz", category: "Privilege Escalation", difficulty: "Avançado", phase: "Manutenção",
    strategy: "Extrair senhas em texto claro, hashes e tickets Kerberos da memória (LSASS) no Windows.",
    command: "privilege::debug, sekurlsa::logonpasswords",
    proTip: "Muitos AVs bloqueiam o Mimikatz. Use técnicas de ofuscação ou rode-o inteiramente na memória via PowerShell."
  },
  {
    id: 37, name: "Proxychains", category: "Evasão", difficulty: "Avançado", phase: "Manutenção",
    strategy: "Roteia o tráfego de qualquer ferramenta de linha de comando através de proxies (SOCKS/HTTP) ou Tor.",
    command: "proxychains nmap -sT 10.0.0.1",
    proTip: "Edite '/etc/proxychains4.conf' e ative 'dynamic_chain' para maior estabilidade se um proxy cair."
  },
  {
    id: 38, name: "BeEF", category: "Web Hooking", difficulty: "Avançado", phase: "Manutenção",
    strategy: "Controlar navegadores de vítimas explorando vulnerabilidades de Cross-Site Scripting (XSS).",
    command: "beef-xss",
    proTip: "Combine com engenharia social para fazer a vítima clicar no link e ser 'fisgada' (hooked) pelo framework."
  },
  {
    id: 39, name: "PowerShell Empire", category: "Post-Exploitation", difficulty: "Avançado", phase: "Manutenção",
    strategy: "Framework de Command and Control (C2) focado em agentes PowerShell e Python indetectáveis.",
    command: "powershell-empire server",
    proTip: "Excelente para redes Windows modernas onde dropar executáveis (.exe) dispara alertas de EDR."
  },
  {
    id: 40, name: "Chisel", category: "Pivoting", difficulty: "Avançado", phase: "Manutenção",
    strategy: "Criar túneis TCP/UDP rápidos sobre HTTP, essencial para acessar redes internas isoladas.",
    command: "chisel server -p 8000 --reverse",
    proTip: "Chisel compila em um único binário Go, facilitando o upload para a máquina vítima."
  },
  {
    id: 41, name: "BloodHound", category: "AD Enumeration", difficulty: "Avançado", phase: "Inteligência",
    strategy: "Mapear visualmente caminhos de ataque e relações de confiança no Active Directory usando Teoria dos Grafos.",
    command: "neo4j console & bloodhound",
    proTip: "Use o ingestor SharpHound.exe na máquina vítima para coletar os dados e importe os JSONs no BloodHound."
  },
  {
    id: 42, name: "CrackMapExec (NetExec)", category: "AD Exploitation", difficulty: "Avançado", phase: "Acesso",
    strategy: "Automatizar a exploração de redes Active Directory (Pass-the-Hash, execução de comandos em massa).",
    command: "cme smb 192.168.1.0/24 -u User -p Pass --local-auth",
    proTip: "O projeto original CME foi descontinuado, a comunidade agora mantém o fork 'NetExec' (nxc)."
  },
  {
    id: 43, name: "Impacket", category: "Network Protocols", difficulty: "Avançado", phase: "Acesso",
    strategy: "Coleção de scripts Python para interagir e explorar protocolos Windows (SMB, MSRPC, Kerberos).",
    command: "psexec.py domain/user:pass@192.168.1.100",
    proTip: "O 'secretsdump.py' do Impacket é a melhor forma de extrair hashes NTDS.dit remotamente de um Domain Controller."
  },
  {
    id: 44, name: "LinPEAS", category: "Linux PrivEsc", difficulty: "Avançado", phase: "Manutenção",
    strategy: "Script automatizado que procura por todas as possíveis vias de escalação de privilégio no Linux.",
    command: "curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh",
    proTip: "Preste atenção nas saídas com fundo VERMELHO e texto AMARELO, elas indicam 99% de chance de vetor de ataque."
  },
  {
    id: 45, name: "WinPEAS", category: "Windows PrivEsc", difficulty: "Avançado", phase: "Manutenção",
    strategy: "Versão para Windows do PEAS, busca credenciais, serviços vulneráveis e falhas de registro.",
    command: "winpeas.exe",
    proTip: "Se não puder dropar o .exe, use a versão .bat ou rode o script PowerShell diretamente da memória."
  },
  {
    id: 46, name: "Volatility", category: "Memory Forensics", difficulty: "Avançado", phase: "Limpeza e Relatório",
    strategy: "Analisar dumps de memória RAM para encontrar malwares, senhas injetadas e conexões ocultas.",
    command: "volatility -f memdump.mem imageinfo",
    proTip: "Sempre comece com 'imageinfo' (Vol2) ou 'windows.info' (Vol3) para descobrir o perfil do SO antes de extrair dados."
  },
  {
    id: 47, name: "Autopsy", category: "Digital Forensics", difficulty: "Avançado", phase: "Limpeza e Relatório",
    strategy: "Plataforma gráfica completa para investigação forense de discos rígidos e imagens de sistema.",
    command: "autopsy",
    proTip: "Use os módulos de 'Ingest' para automatizar a busca por imagens, e-mails e arquivos deletados."
  },
  {
    id: 48, name: "Ghidra", category: "Reverse Engineering", difficulty: "Avançado", phase: "Inteligência",
    strategy: "Descompilar e analisar binários (malwares ou exploits) criado pela NSA.",
    command: "ghidra",
    proTip: "O atalho 'E' exporta o código descompilado em C, facilitando a leitura de malwares complexos."
  },
  {
    id: 49, name: "Radare2", category: "Reverse Engineering", difficulty: "Avançado", phase: "Inteligência",
    strategy: "Framework de engenharia reversa via linha de comando, extremamente leve e poderoso.",
    command: "r2 binario",
    proTip: "Digite 'aaa' após abrir o arquivo para analisar todas as funções, e 'pdf' para imprimir a função atual."
  },
  {
    id: 50, name: "Dradis / CherryTree", category: "Reporting", difficulty: "Avançado", phase: "Limpeza e Relatório",
    strategy: "Organizar anotações, evidências e gerar o relatório final do Pentest.",
    command: "cherrytree",
    proTip: "A organização é a arma mais forte de um Sênior. Crie templates de nós no CherryTree para cada host descoberto."
  }
];
