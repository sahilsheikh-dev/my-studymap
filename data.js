/* ═══════════════════════════════════════════════════════════════════════════
   ROADMAP DATA — import this before index.html's main script
   All topic content lives here. index.html contains zero data.
═══════════════════════════════════════════════════════════════════════════ */

const PHASE_ORDER = ["overview","foundation","platform","cloud","observability","scripting"];
const PHASE_LABELS = {
  overview:      "Start here",
  foundation:    "Phase 1: Foundation",
  platform:      "Phase 2: Platform",
  cloud:         "Phase 3: Cloud",
  observability: "Phase 4: Observability",
  scripting:     "Phase 5: Scripting"
};

const TOPICS = [

  /* ── OVERVIEW ── */
  {
    id:"overview", label:"Overview", phase:"overview",
    title:"Learning roadmap overview",
    why:"Before diving in, understand the full sequence and why each topic comes before the next. This is not a random list — each layer enables the next.",
    badges:[], content:"overview"
  },

  /* ════════════════════════════════════════════
     PHASE 1: FOUNDATION
  ════════════════════════════════════════════ */
  {
    id:"linux", label:"Linux", phase:"foundation",
    title:"Linux fundamentals",
    why:"Every DevOps tool runs on Linux. Kubernetes nodes are Linux. EC2 instances are Linux. CI runners are Linux. Without this, nothing else makes sense.",
    badges:[{t:"Foundation",c:"b-foundation"}],
    prereqs:["Basic computer usage","Willingness to use a terminal"],
    stages:[
      {label:"Beginner",items:[
        "Filesystem hierarchy: /etc /var /proc /sys /home /boot /dev /tmp",
        "Basic commands: ls, cd, cp, mv, rm, mkdir, find, grep, chmod, chown, touch",
        "Viewing file contents: cat, head, tail, less, wc — essential for log inspection",
        "Pipes and redirection: | (pipe), > (overwrite), >> (append), 2>&1, /dev/null",
        "Users, groups, permissions: rwx notation, chmod octal, chown, chgrp",
        "Package managers: apt (Debian/Ubuntu), yum/dnf (RHEL/CentOS/Rocky)",
        "Text editors: vim basics (insert/normal/command mode, :wq, :q!, /search), nano",
        "Processes: ps aux, top, kill, pkill, systemd/systemctl start/stop/enable/status",
        "Getting help: man pages, --help flag, info, apropos, whatis"
      ]},
      {label:"Intermediate",items:[
        "Regular expressions: grep -E (ERE), sed substitution (s/old/new/g), basic awk field extraction",
        "VI/Vim proficiency: motions (w/b/G/gg), search & replace (:%s/), visual mode, split panes — non-negotiable on remote servers",
        "Advanced file permissions: SUID (run as owner), SGID (inherit group), sticky bit (shared dirs like /tmp)",
        "Access Control Lists (ACL): getfacl, setfacl — fine-grained permissions beyond rwx",
        "File links & inodes: hard links share inode, soft/symbolic links point by path — understand df -i, ls -li",
        "Networking tools: ip addr, ss, netstat, ping, traceroute, nslookup, curl, dig, wget",
        "Log files: journalctl -u/-f/-since, /var/log, logrotate config, /var/log/secure vs messages",
        "Cron and scheduling: crontab -e syntax (min hr dom mon dow), at for one-time jobs, /etc/cron.d",
        "SSH advanced: key-based auth (~/.ssh/authorized_keys), config file (~/.ssh/config), tunneling (-L/-R/-D), scp/rsync",
        "Performance tools: vmstat, iostat, free -h, df -h, du -sh, sar, uptime, lscpu, lsmem",
        "LVM: PV, VG, LV concepts — pvcreate, vgcreate, lvcreate, lvextend; how containers and cloud VMs use it",
        "Boot process: BIOS/UEFI → GRUB2 → kernel → initramfs → systemd — know each stage for troubleshooting",
        "systemd targets: multi-user.target vs graphical.target, changing default target, rescue.target for recovery",
        "File descriptors: stdin(0), stdout(1), stderr(2), redirection, /proc/PID/fd"
      ]},
      {label:"Advanced",items:[
        "SELinux: enforcing/permissive/disabled modes, contexts (ls -Z), restorecon, semanage, audit2allow, setsebool — mandatory for RHEL production",
        "Firewall management: firewall-cmd (firewalld zones, services, ports, --permanent), iptables/nftables rules, ufw",
        "NTP and time sync: chronyc tracking, chronyd config (/etc/chrony.conf), timedatectl — drift causes TLS failures and log correlation issues",
        "GRUB2 and kernel management: grub2-mkconfig, default kernel selection, /boot/grub2/grub.cfg, removing old kernels safely",
        "LUKS disk encryption: cryptsetup luksFormat/open, /etc/crypttab, dm-crypt — required for compliance workloads",
        "Filesystem repair: fsck (ext2/3/4), xfs_repair, e2fsck — run only on unmounted filesystems",
        "/proc and /sys internals: /proc/meminfo, /proc/cpuinfo, /proc/net/tcp, /sys/block for disk stats",
        "Kernel parameters: sysctl -a, /etc/sysctl.conf tuning for net.ipv4.*, vm.swappiness, fs.file-max",
        "Namespaces and cgroups: the kernel primitives that make containers work — unshare, nsenter, cgroupv2 hierarchy",
        "strace, lsof, perf, ltrace: trace syscalls and open files for deep debugging — used when logs give nothing",
        "TCP Wrappers: /etc/hosts.allow and /etc/hosts.deny — still present in many enterprise RHEL environments",
        "Swap management: swapon/swapoff, mkswap, creating swap files, monitoring with vmstat si/so columns",
        "systemd unit files: writing and installing custom .service files, ExecStart/ExecStop/Restart, WantedBy"
      ]}
    ],
    projects:[
      "Set up a Linux VM (Rocky/Ubuntu), manage users/groups/permissions, reproduce a 'permission denied' scenario and fix it correctly",
      "Write a disk usage monitor script: alert when any filesystem exceeds 80%, rotate logs, run via cron",
      "Harden an SSH server: disable root login, enforce key-only auth, change port, configure fail2ban",
      "Configure SELinux in enforcing mode, deploy a custom app, use audit2allow to generate and apply the correct policy",
      "Set up firewalld: create a custom zone, allow only HTTP/HTTPS/SSH, block everything else, persist across reboots",
      "Simulate a boot failure: corrupt GRUB config in a VM, boot into rescue mode, fix and restore normal boot",
      "Extend an LVM logical volume online: add a disk, create PV, extend VG, resize LV and filesystem without downtime"
    ],
    usecases:[
      "Debugging a service crash on a production EC2 node: journalctl -u, strace, lsof to find what went wrong",
      "Reading /proc/meminfo and vmstat during a memory leak or OOM kill investigation",
      "SELinux blocking an app from writing to a directory: read audit.log, use audit2allow, apply policy without disabling SELinux",
      "Setting kernel parameters (sysctl) for high-connection web servers: net.core.somaxconn, net.ipv4.tcp_tw_reuse",
      "Tracing a cron job that silently fails: redirect stdout/stderr to a log file, check /var/log/cron, debug via journalctl",
      "Firewall misconfiguration blocking application traffic: firewall-cmd --list-all, identify the missing rule, fix without reboot"
    ],
    mistakes:[
      "Using GUI-based approaches and not building CLI muscle memory — remote servers have no GUI",
      "Not understanding file permissions leading to 'permission denied' rabbit holes — know octal and SUID/SGID",
      "Ignoring systemd — it manages every service in modern Linux and is the first stop for any service failure",
      "Disabling SELinux instead of learning it — a common shortcut that fails compliance audits and creates real security holes",
      "Not quoting variables in scripts — space-in-filename bugs and subtle security issues",
      "Running fsck on a mounted filesystem — causes corruption, always unmount first"
    ],
    production:"Every CI runner, container host, and cloud VM is Linux. It is the substrate. There is no DevOps without Linux proficiency. SELinux, firewalld, LVM, and systemd are present in every RHEL-based production environment — which covers the majority of enterprise Linux.",
    ready:[
      "Navigate the filesystem and explain every major directory's purpose including /proc and /sys",
      "Write a bash one-liner to find and kill processes, and a cron job to schedule it",
      "Manage services with systemctl and change systemd targets for troubleshooting — without googling",
      "SSH into a server, configure key-only auth, set up ~/.ssh/config for multiple hosts",
      "Read and write regular expressions: extract fields with grep -E, do in-place substitution with sed",
      "Explain SUID, SGID, sticky bit with a real use case for each — and set them correctly",
      "Put SELinux in enforcing mode, diagnose a denial from /var/log/audit/audit.log, and fix it without disabling SELinux",
      "Add a firewalld rule, make it permanent, and verify it survives a reboot"
    ]
  },

  {
    id:"networking", label:"Networking", phase:"foundation",
    title:"Networking fundamentals",
    why:"You cannot debug Kubernetes networking, cloud VPCs, or CI/CD connectivity issues without understanding how packets actually travel.",
    badges:[{t:"Foundation",c:"b-foundation"}],
    prereqs:["Linux basics — commands, filesystem, ssh"],
    stages:[
      {label:"Beginner",items:["OSI model — know layers 3,4,7 deeply","IP addressing: subnets, CIDR notation, private ranges","DNS: resolution chain, A/CNAME/MX records, TTL","TCP vs UDP — when and why","HTTP/HTTPS: request/response, status codes, headers","Common ports: 22, 80, 443, 3306, 6379, 8080"]},
      {label:"Intermediate",items:["TCP 3-way handshake, connection states (TIME_WAIT, CLOSE_WAIT)","Firewalls: iptables rules, ufw","NAT, routing tables, gateway","Load balancing: L4 vs L7","TLS/SSL: certificate chain, handshake, SNI","Tools: tcpdump, Wireshark, curl -v, dig, nmap"]},
      {label:"Advanced",items:["VPC networking in cloud: subnets, route tables, NAT gateways, peering","Service discovery: DNS-based vs API-based","Kubernetes CNI plugins: Calico, Flannel, Cilium","Network policies in Kubernetes","BGP basics for cloud environments","HTTP/2, gRPC, WebSocket at the protocol level"]}
    ],
    projects:["Set up a multi-subnet network in a VirtualBox lab — route traffic between them","Capture HTTP traffic with tcpdump and read the request","Configure iptables to block/allow specific ports","Set up DNS with bind or use /etc/hosts for local resolution"],
    usecases:["Kubernetes pod-to-pod connectivity failing: debug with tcpdump and network policy check","DNS TTL causing stale endpoints after failover","Load balancer health check misconfiguration causing traffic drop"],
    mistakes:["Memorizing OSI layers without understanding how to use them for debugging","Not knowing CIDR notation — blocks cloud networking work","Skipping TCP state knowledge — critical for production debugging"],
    production:"VPC design, security group rules, Kubernetes network policies, and service mesh configuration are all networking tasks you will do weekly in senior DevOps roles.",
    ready:["Explain why a pod cannot reach another pod in a different namespace","Subnet a /16 CIDR into /24 subnets without a calculator","Use dig and tcpdump to trace a DNS issue","Explain what happens at each layer when you type a URL in a browser"]
  },

  {
    id:"bash", label:"Bash Scripting", phase:"foundation",
    title:"Shell and Bash scripting",
    why:"Bash is the glue of DevOps. Every CI job, deployment script, and automation runbook starts here. Python comes later for complex tasks — bash comes first for speed.",
    badges:[{t:"Scripting",c:"b-scripting"}],
    prereqs:["Linux CLI comfort — at least beginner level complete"],
    stages:[
      {label:"Beginner",items:["Variables, quoting rules (single vs double)","Conditionals: if/elif/else","Loops: for, while, until","Functions — declaration and return values","Exit codes and $?","Reading user input, arguments $1 $2 $@"]},
      {label:"Intermediate",items:["Arrays and associative arrays","String manipulation: ${var#prefix} ${var%suffix}","Process substitution: <(cmd) >(cmd)","Error handling: set -euo pipefail","Traps: trap 'cleanup' EXIT ERR","Regex with grep/sed/awk"]},
      {label:"Advanced",items:["Here-docs and here-strings","File locking with flock","Background jobs, wait, job control","Parsing JSON/YAML with jq/yq","Writing idempotent scripts","xargs and parallel for concurrency"]}
    ],
    projects:["Write a backup script: archive /etc, rotate last 7 backups, alert if disk > 80%","Write a deployment script: pull image, stop old container, run new one, health-check","Parse a JSON API response with curl + jq and extract specific fields","Write a log analysis script: count error rates per minute from access.log"],
    usecases:["CI pipeline step that validates environment variables before deploying","On-call runbook automated: detect, notify, and attempt auto-remediation","Batch rename/process files across thousands of objects in S3"],
    mistakes:["Not using set -euo pipefail — scripts silently continue on errors","Forgetting to quote variables — space-in-filename bugs","Writing non-idempotent scripts that break on re-run"],
    production:"Every Dockerfile CMD/ENTRYPOINT, CI job step, and Kubernetes init container runs bash scripts. You write them daily.",
    ready:["Write a script that deploys an app, health-checks it, and rolls back on failure","Parse a REST API response and trigger conditional logic on the result","Write a script that is safe to run multiple times without side effects"]
  },

  {
    id:"git", label:"Git & GitHub", phase:"foundation",
    title:"Git and GitHub",
    why:"Git is the source of truth for everything: code, infrastructure, config, and policies. Every tool in this roadmap integrates with git. Learn it before CI/CD.",
    badges:[{t:"Foundation",c:"b-foundation"}],
    prereqs:["Bash basics — you'll use git from the CLI"],
    stages:[
      {label:"Beginner",items:["clone, add, commit, push, pull","Branches: create, switch, merge",".gitignore — what to never commit (secrets, build artifacts)","Remotes: origin, upstream","Resolving basic merge conflicts","GitHub: PRs, issues, forks"]},
      {label:"Intermediate",items:["Rebase: interactive rebase, squash commits","Cherry-pick for selective commits","Git stash and stash pop","Tags for release management","Hooks: pre-commit, commit-msg","Branch protection rules on GitHub"]},
      {label:"Advanced",items:["GitOps: git as the single source of truth for infra","Signed commits with GPG","Monorepo vs polyrepo trade-offs","CODEOWNERS for automated review assignments","Large file storage: Git LFS","Audit trail: git blame, git log --follow"]}
    ],
    projects:["Set up a repo with branch protection: no direct pushes to main, require PR + review","Simulate a merge conflict, resolve it, and push a clean history","Tag a release, push, and write a meaningful changelog","Set up a pre-commit hook that runs a linter before every commit"],
    usecases:["Every infra change is a git commit — full audit trail","GitOps: Argo CD watches a git repo and applies changes to Kubernetes","Release management: tagging versions, hotfix branches"],
    mistakes:["Committing secrets or .env files — a career-limiting move","Force-pushing to shared branches and destroying team history","Not writing meaningful commit messages — 'fix stuff' is useless in postmortems"],
    production:"Git is not optional. It's the backbone of everything. Every CI/CD pipeline starts with a git event.",
    ready:["Explain the difference between merge and rebase with confidence","Set up a complete git workflow for a team: branching strategy, protection rules, PR template","Recover a lost commit using git reflog"]
  },

  /* ════════════════════════════════════════════════════════════════
     PHASE 2: PLATFORM
  ════════════════════════════════════════════════════════════════ */
  {
    id:"cicd_fundamentals", label:"CI/CD Fundamentals", phase:"platform",
    title:"CI/CD fundamentals (conceptual foundation)",
    why:"Before touching GitHub Actions, Jenkins, or GitLab CI, you must understand what a CI/CD pipeline is, why it exists, and what every stage is doing. All three tools implement the same underlying concept — learn the concept first.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Git and GitHub — pipelines trigger on git events","Bash scripting — pipeline steps are shell commands","Docker basics helpful — many CI steps build or run containers"],
    stages:[
      {label:"Beginner",items:["What CI means: automated build and test on every commit","What CD means: Continuous Delivery (ready to deploy) vs Continuous Deployment (auto-deploys)","Pipeline anatomy: trigger → stages → jobs → steps → artifacts","The build-test-deploy loop and why it exists","Fail fast principle: catch errors as early and cheaply as possible","What a pipeline artifact is: built binary, Docker image, test report"]},
      {label:"Intermediate",items:["Environment promotion: code travels dev → staging → prod via pipeline","Gating mechanisms: automated quality gates, manual approval gates","Pipeline as code: YAML/Groovy vs GUI-configured pipelines","Branch strategies and how they drive pipeline behavior (trunk-based vs gitflow)","Idempotent pipelines: same input always produces same output","Secrets in pipelines: why environment variables, not hardcoded values"]},
      {label:"Advanced",items:["Pipeline observability: measuring pipeline duration, failure rate, MTTR","DORA metrics: deployment frequency, lead time, change failure rate, MTTR","Shift-left security: SAST, SCA, secrets scanning as pipeline gates","Progressive delivery: feature flags, canary releases, A/B tests as pipeline outputs","GitOps as an evolution of CD: pull-based vs push-based deployments","Pipeline as a product: ownership, SLOs, and treating CI as internal infrastructure"]}
    ],
    projects:["Draw the complete pipeline flow for a real web app: every stage, every gate, every artifact — before writing a single line of YAML","Compare push-based CD (GitHub Actions deploy step) vs pull-based CD (Argo CD) — write a 1-page architectural trade-off doc","Design a pipeline with 4 gates: unit tests, SAST scan, staging smoke test, manual prod approval — define what blocks promotion at each gate","Calculate the DORA metrics for your own projects: deployment frequency, lead time to production"],
    usecases:["Explaining to a product manager why a feature isn't in prod yet: trace it through the pipeline stages","Diagnosing a failed deployment: which stage failed, what artifact was bad, what gate should have caught it","Designing a pipeline for a new service: how many environments, what gates, how long should it take"],
    mistakes:["Jumping straight into YAML syntax without understanding what the pipeline is supposed to do","Confusing Continuous Delivery (human clicks deploy) with Continuous Deployment (fully automated to prod)","Building pipelines that only run on main — feature branches need CI too","No artifact versioning — you can't roll back what you can't identify"],
    production:"Every production deployment in a modern org flows through a pipeline. Understanding the model means you can debug any pipeline, in any tool, without needing to know its YAML syntax first.",
    ready:["Explain the difference between CI and CD to a developer who has never used either","Draw a pipeline architecture for a 3-environment (dev/staging/prod) system with gates","Articulate what DORA metrics are and how a pipeline improves or degrades them","Identify which pipeline stage should catch: a syntax error, a security vulnerability, a broken integration test, a failed smoke test"]
  },

  {
    id:"docker", label:"Docker", phase:"platform",
    title:"Docker and containers",
    why:"Containers are the atomic unit of modern deployment. Kubernetes orchestrates containers. CI/CD builds containers. Learn Docker before Kubernetes — you need to understand what K8s is managing.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Linux internals (namespaces, cgroups conceptually)","Bash scripting","Git — Dockerfiles live in repos"],
    stages:[
      {label:"Beginner",items:["docker run, pull, build, stop, rm, ps","Dockerfile: FROM, RUN, COPY, CMD, ENTRYPOINT, EXPOSE","Image layers and caching","Volumes and bind mounts","docker-compose for multi-service local dev","Port mapping: -p host:container"]},
      {label:"Intermediate",items:["Multi-stage builds for smaller images","Distroless and minimal base images","Health checks in Dockerfile","Networking: bridge, host, overlay networks","docker buildx for multi-platform builds","Image tagging strategies: semver, git sha, latest (avoid latest in prod)"]},
      {label:"Advanced",items:["Container security: non-root user, read-only filesystem, seccomp","BuildKit caching in CI pipelines","Container resource limits (--memory --cpus)","Scanning images: Trivy, Snyk","Signing images with Cosign","Registry management: push, pull, tag across registries"]}
    ],
    projects:["Containerize a Node.js or Python app: multi-stage, non-root, < 100MB","Build a docker-compose stack: app + postgres + redis + nginx reverse proxy","Write a CI step that builds, scans, and pushes an image only on main branch","Reduce an existing image from 800MB to under 100MB using multi-stage + distroless"],
    usecases:["Every microservice packaged as an immutable container image","CI pipeline builds image, pushes to ECR, Kubernetes pulls and deploys","Local development that matches production: no 'works on my machine'"],
    mistakes:["Running containers as root in production","Using 'latest' tag — makes rollbacks impossible","Storing secrets in ENV in Dockerfile — they end up in image history","Fat images: installing tools in the final stage, not multi-stage building"],
    production:"Container images are the deployment artifact. Build once, deploy everywhere. Kubernetes pulls the exact same image tested in CI.",
    ready:["Build a production-ready image: multi-stage, non-root, minimal, scanned, signed","Explain the difference between CMD and ENTRYPOINT and when to use each","Debug a container that keeps crashing using docker logs and docker exec"]
  },

  {
    id:"kubernetes", label:"Kubernetes", phase:"platform",
    title:"Kubernetes",
    why:"Kubernetes is the operating system of the cloud. Every production container workload at scale runs on it or something built on it. This is the highest-leverage skill in this roadmap.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Docker — solid understanding of containers","Networking — TCP, DNS, load balancing","Linux — comfortable on the CLI","YAML — fluent"],
    stages:[
      {label:"Beginner",items:["Pods, Deployments, Services, ConfigMaps, Secrets","kubectl: get, describe, logs, exec, apply, delete","Namespaces for isolation","Resource requests and limits","Health checks: readinessProbe, livenessProbe","Rolling updates and rollback"]},
      {label:"Intermediate",items:["StatefulSets for databases","DaemonSets for node-level agents","Ingress and IngressController (Nginx, Traefik)","PersistentVolumes, PVC, StorageClass","RBAC: Roles, ClusterRoles, Bindings","HorizontalPodAutoscaler (HPA)","Helm charts: install, upgrade, rollback, template"]},
      {label:"Advanced",items:["Control plane internals: etcd, API server, scheduler, controller-manager","Custom Resources (CRDs) and Operators","PodDisruptionBudgets for zero-downtime maintenance","Cluster autoscaler and Karpenter","Network policies for pod-level firewall","Admission controllers and webhooks","Multi-cluster management with Argo CD"]}
    ],
    projects:["Deploy a 3-tier app (frontend + backend + database) on a local cluster (minikube/kind)","Write a Helm chart for a stateless service with environment-specific values","Set up RBAC: developers can deploy to 'dev' namespace, read-only on 'prod'","Configure HPA based on CPU + custom metric, load test and watch it scale"],
    usecases:["Rolling deploy with zero downtime — Kubernetes handles traffic shifting","Auto-scale pods on Black Friday traffic spike","Node failure: Kubernetes reschedules pods automatically to healthy nodes","Canary deployment: 5% traffic to new version via Argo Rollouts"],
    mistakes:["No resource requests/limits — one noisy pod starves others","No readiness probes — pod gets traffic before it's ready","Using 'latest' image tag — can't roll back reliably","Putting everything in the default namespace"],
    production:"Kubernetes is the platform team's product. Every app team deploys onto it. You need to operate the cluster, not just deploy to it.",
    ready:["Explain why a pod is in CrashLoopBackOff and fix it","Write a Helm chart from scratch and deploy it to multiple environments","Drain a node for maintenance with zero service disruption","Design RBAC for a 5-team engineering org on one cluster"]
  },

  {
    id:"nexus", label:"Artifact Registries", phase:"platform",
    title:"Nexus, Artifactory, and Docker Hub",
    why:"Every build artifact — container images, JAR files, npm packages, Python wheels — needs a versioned, secure storage location. These are the artifact stores that CI/CD pipelines push to and Kubernetes pulls from.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Docker — you need to understand images before managing them","Git — artifacts are outputs of git-triggered CI pipelines","CI/CD basics — pipelines produce artifacts"],
    stages:[
      {label:"Beginner",items:["Docker Hub: push, pull, public vs private repos","Image tagging conventions: semver, git-sha, environment tags","Registry authentication: docker login, credentials","ECR/ACR/Artifact Registry as cloud-native alternatives","Pulling images in Kubernetes: imagePullSecrets"]},
      {label:"Intermediate",items:["Nexus Repository Manager: hosted, proxy, and group repos","Artifactory: local, remote, virtual repos","Proxying public registries (npmjs, PyPI, Docker Hub) to reduce external dependencies","Retention policies: clean up old image tags","Scanning images in the registry: Trivy, Clair","Repository permissions and access control"]},
      {label:"Advanced",items:["Geo-replication for global teams","Immutable artifact promotion: dev → staging → prod, same artifact","Image signing and verification in the deployment pipeline","SBOM storage and querying","Integration with CI: push on build, pull on deploy","High availability and disaster recovery for registries"]}
    ],
    projects:["Set up Nexus as a Docker registry and a PyPI proxy — never hit public PyPI directly","Build a CI pipeline that pushes to ECR with git-sha tag and latest is never used in prod","Implement image scanning: fail the pipeline if critical CVEs exist","Set up imagePullSecrets in Kubernetes to pull from private ECR"],
    usecases:["Immutable artifact promotion: the same image SHA deployed through dev → staging → prod","Air-gapped environments: all packages proxied through internal Nexus — no internet access","Audit trail: every image deployed to prod has a traceable git commit and build ID"],
    mistakes:["Using 'latest' tag in Kubernetes manifests — cannot roll back","Allowing direct pulls from public Docker Hub in production — rate limits and supply chain risk","No retention policy — registry storage fills up and becomes expensive"],
    production:"Artifact registries are the supply chain of your deployments. Control what goes in, control what goes out.",
    ready:["Explain why using 'latest' in Kubernetes is dangerous and what to use instead","Set up a private registry and integrate it with a CI/CD pipeline end to end","Implement a scanning gate that blocks promotion of images with critical CVEs"]
  },

  {
    id:"github_actions", label:"GitHub Actions", phase:"platform",
    title:"GitHub Actions (CI/CD)",
    why:"GitHub Actions is the most widely adopted CI platform today. It integrates natively with GitHub repos, runs on every push/PR, and connects to every cloud. Start here before Jenkins.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Git + GitHub — workflows trigger on git events","Docker — most CI steps run in containers","Bash scripting — steps are shell commands","Cloud basics — pipelines deploy to cloud"],
    stages:[
      {label:"Beginner",items:["Workflow YAML structure: on, jobs, steps","Triggers: push, pull_request, schedule, workflow_dispatch","Actions: uses, with, env","Runners: GitHub-hosted vs self-hosted","Secrets and environment variables","Matrix builds for testing multiple versions"]},
      {label:"Intermediate",items:["Reusable workflows and composite actions","Environments with required reviewers and wait timers","Caching: actions/cache for dependencies and build artifacts","Artifacts: upload-artifact, download-artifact between jobs","OIDC integration: authenticate to AWS/Azure/GCP without static keys","Concurrency control: cancel in-progress on new push"]},
      {label:"Advanced",items:["Self-hosted runners on EKS or EC2 with autoscaling","GitHub Actions security: GITHUB_TOKEN permissions, pinning action SHAs","Deployment environments with branch protection","BuildKit cache export/import for fast Docker builds","GitOps integration: trigger Argo CD sync from Actions","Workflow optimization: parallelism, skipping unchanged paths"]}
    ],
    projects:["Build a full CI pipeline: lint → test → build Docker image → scan → push to ECR","Add OIDC authentication to AWS: deploy to EKS without AWS access keys in secrets","Set up environment gates: auto-deploy to staging, require approval for prod","Build a reusable workflow that other repos can call for their standard build process"],
    usecases:["Every PR triggers tests and security scans — no broken code reaches main","Production deploy on merge to main, gated by staging environment passing","Scheduled nightly job: run performance tests and post results to Slack"],
    mistakes:["Storing cloud credentials as long-lived secrets instead of using OIDC","Not pinning third-party action SHAs — supply chain attack vector","Checking out code without least-privilege token permissions","Not caching dependencies — 20min builds that should be 3min"],
    production:"GitHub Actions is used for every step from code to production: test, build, scan, push, deploy. It is the CI/CD backbone for most modern engineering orgs.",
    ready:["Build a pipeline that deploys to Kubernetes on merge, with staging gate and prod approval","Implement OIDC auth to AWS — zero static credentials in secrets","Build and publish a reusable GitHub Actions workflow for use across 10 repos"]
  },

  {
    id:"jenkins", label:"Jenkins", phase:"platform",
    title:"Jenkins",
    why:"Jenkins is the most widely deployed CI server in the world — especially in enterprises. Older but heavily present in production. Learn it to work with existing orgs, not because it's the best.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["GitHub Actions or similar — so you understand CI/CD concepts first","Groovy basics helpful — Jenkinsfile uses Groovy DSL","Docker — Jenkins pipelines run stages in containers","Linux/networking — Jenkins runs on a server you manage"],
    stages:[
      {label:"Beginner",items:["Jenkins installation and initial setup","Freestyle jobs vs Pipeline jobs","Jenkinsfile: declarative vs scripted syntax","Agents and executors","Credentials management in Jenkins","Build triggers: SCM polling, webhooks, manual"]},
      {label:"Intermediate",items:["Shared Libraries for reusable pipeline code","Parallel stages for faster builds","Blue Ocean UI for pipeline visualization","Dynamic agent provisioning: Kubernetes plugin, EC2 plugin","Artifact archiving and fingerprinting","Multibranch pipelines for feature branch CI"]},
      {label:"Advanced",items:["Jenkins as code: JCasC (Jenkins Configuration as Code)","High availability: Jenkins active-active with controllers","Security: matrix authorization, script approval, CSRF protection","Plugin management at scale — auditing and updating safely","Migrating Jenkins to GitHub Actions or GitLab CI","Performance tuning: build queue analysis, agent utilization"]}
    ],
    projects:["Write a declarative Jenkinsfile: build → test → Docker build → push → deploy to K8s","Set up a shared library with reusable functions used across 5 different Jenkinsfiles","Configure dynamic Kubernetes agents: each build spins up a pod and terminates after","Implement JCasC: entire Jenkins config in a git repo, reprovisioning via code"],
    usecases:["Large enterprise with 500 pipelines built over 8 years — not migrating overnight","Complex pipelines with many conditional stages and custom plugins","On-premise CI for air-gapped environments where GitHub Actions runners can't reach the internet"],
    mistakes:["Using Jenkins without JCasC — configuration drift is unmanageable at scale","Installing too many plugins — each is a maintenance burden and security surface","Not using shared libraries — copy-pasted Jenkinsfiles across 100 repos","Scripted pipelines for new work — declarative is safer and cleaner"],
    production:"Jenkins runs CI/CD for a huge portion of enterprises. You will encounter it. Knowing it is required — even if you eventually migrate org away from it.",
    ready:["Write a complete declarative Jenkinsfile for a real application from scratch","Implement a shared library and use it across multiple Jenkinsfiles","Provision and configure Jenkins entirely as code using JCasC"]
  },

  {
    id:"gitlab", label:"GitLab", phase:"platform",
    title:"GitLab CI/CD",
    why:"GitLab is a complete DevOps platform: git hosting + CI/CD + container registry + security scanning + Kubernetes integration in one tool. Strong in European orgs and self-hosted enterprises.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Git fundamentals","GitHub Actions or Jenkins — so you already understand CI/CD pipelines","Docker and Kubernetes"],
    stages:[
      {label:"Beginner",items:[".gitlab-ci.yml structure: stages, jobs, scripts","Runners: shared vs specific, executor types (shell, Docker, Kubernetes)","Variables: predefined CI variables, custom, masked, protected","Artifacts and caching in pipeline jobs","Merge request pipelines and branch pipelines","GitLab Container Registry: built-in image storage"]},
      {label:"Intermediate",items:["Includes and extends for reusable pipeline config","Environments: deployment tracking, rollback button","Rules and only/except for conditional job execution","GitLab Kubernetes Agent for pull-based deployments","Auto DevOps: opinionated CI/CD out of the box","Security scanning: SAST, DAST, dependency scanning, container scanning — built in"]},
      {label:"Advanced",items:["GitLab as a complete DevSecOps platform: single tool for everything","Runner autoscaling: Kubernetes executor with autoscaling","Parent-child pipelines and dynamic child pipelines","Compliance pipelines: enforced security stages across all projects","GitLab Operator for self-managed Kubernetes deployment","Multi-project pipelines for microservice orchestration"]}
    ],
    projects:["Build a complete .gitlab-ci.yml: test → build → SAST scan → push to registry → deploy to K8s","Use GitLab Kubernetes Agent for pull-based deployment to a cluster","Set up GitLab security dashboards: aggregate vulnerabilities across 10 projects","Write a template pipeline using include and use it across 5 different project repos"],
    usecases:["Single platform: developers never leave GitLab from code to deployment","Built-in security scanning on every MR — no third-party integrations needed","Self-hosted for air-gapped or regulated environments with full control"],
    mistakes:["Defining all jobs inline without using include templates — unmanageable at scale","Using shared runners for production deployments without proper isolation","Not using GitLab environments — losing deployment tracking and rollback capability"],
    production:"GitLab's all-in-one approach makes it operationally simpler for orgs that want one tool. Security scanning built-in is a genuine differentiator.",
    ready:["Build a complete pipeline using includes and dynamic child pipelines","Use the GitLab Kubernetes Agent for GitOps-style deployments","Configure and interpret the GitLab security dashboard for a multi-project group"]
  },

  {
    id:"terraform", label:"Terraform", phase:"platform",
    title:"Terraform (Infrastructure as Code)",
    why:"Terraform is the industry standard for IaC. It manages cloud infrastructure across all three clouds with a single tool. Every senior DevOps/SRE writes Terraform daily.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["AWS, Azure, or GCP — at least one cloud fundamentals complete","Git — Terraform code lives in git, state managed remotely","Bash — Terraform workflows are scripted"],
    stages:[
      {label:"Beginner",items:["Providers, resources, variables, outputs","terraform init, plan, apply, destroy","State file: what it is, why it matters","Remote state: S3 + DynamoDB locking, GCS, Azure Blob","Data sources to reference existing resources",".tfvars files for environment-specific values"]},
      {label:"Intermediate",items:["Modules: writing, versioning, composition","Workspaces (and why account-per-env is better)","count and for_each for dynamic resources","Locals for intermediate values","terraform import for existing resources","Lifecycle rules: create_before_destroy, prevent_destroy","depends_on for explicit ordering"]},
      {label:"Advanced",items:["Custom modules with complex variable types","Terragrunt for DRY multi-environment configs","Atlantis for PR-based apply workflow in teams","Policy as Code with OPA/Sentinel and tfsec/Checkov","State surgery: terraform state mv, rm, pull, push","Drift detection and remediation","Provider version pinning and upgrade strategy"]}
    ],
    projects:["Build a complete AWS VPC + EKS cluster in Terraform from scratch","Write a reusable module for an ECS service with ALB, autoscaling, and CloudWatch","Set up remote state with S3 + DynamoDB locking and state locking validation","Integrate tfsec into CI: block PRs that introduce high-severity findings"],
    usecases:["Spinning up a full staging environment identical to prod in 10 minutes","Detecting infrastructure drift: what changed outside of Terraform","Destroying a dev environment at 6pm and recreating it at 9am — automated"],
    mistakes:["Storing state locally — breaks team workflows immediately","Not locking state — concurrent applies corrupt state","Using workspaces for environment isolation instead of separate accounts/state files","Hardcoding values instead of using variables — makes modules useless"],
    production:"Every cloud resource created manually is a reliability and compliance risk. Terraform makes infra reproducible, auditable, and reviewable.",
    ready:["Write a Terraform module that another engineer can use without reading your code","Recover from a corrupted or conflicting state file","Run a plan, explain every change, and argue whether they're safe to apply"]
  },

  {
    id:"ansible", label:"Ansible", phase:"platform",
    title:"Ansible (configuration management)",
    why:"Ansible manages configuration on servers that already exist. Terraform creates infrastructure; Ansible configures it. Needed for non-containerized workloads, OS hardening, and app configuration.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Linux — deep CLI comfort","SSH — Ansible connects via SSH","YAML — Ansible playbooks are YAML","Python basics help — Ansible is Python under the hood"],
    stages:[
      {label:"Beginner",items:["Inventory: static and dynamic (AWS EC2 plugin)","Playbooks: plays, tasks, handlers","Modules: package, service, file, copy, template","Variables: group_vars, host_vars, vars_files","Facts: ansible_facts, setup module","Ad-hoc commands: ansible all -m ping"]},
      {label:"Intermediate",items:["Roles: directory structure, defaults, handlers, meta","Ansible Vault for encrypting secrets","Tags for selective task execution","Conditionals: when, failed_when, changed_when","Loops: with_items, loop","Jinja2 templating in tasks and templates","Testing with Molecule"]},
      {label:"Advanced",items:["Dynamic inventory with cloud plugins","Custom modules in Python","Ansible Tower/AWX for enterprise scheduling and RBAC","Error handling: block/rescue/always","Rolling updates: serial, max_fail_percentage","Idempotency testing — running twice yields same result","Ansible collections from Galaxy"]}
    ],
    projects:["Write a playbook to harden 10 Ubuntu servers: disable root SSH, set up fail2ban, configure sysctl","Deploy an Nginx + app service across a fleet using a role","Build a rolling update playbook: update 2 servers at a time, stop if any fail","Write a dynamic inventory script that pulls EC2 instances tagged 'Environment: prod'"],
    usecases:["Baseline OS hardening for every new EC2 instance","Deploying config changes to 200 servers in parallel","Automating certificate rotation across a fleet"],
    mistakes:["Writing non-idempotent tasks — command and shell modules are not idempotent","Not using roles — large flat playbooks become unmaintainable","Storing secrets in plaintext in playbooks — use Vault","Not testing with Molecule — bugs found in prod instead of dev"],
    production:"Ansible is used for any workload not yet containerized. It's also the standard for OS-level hardening, certificate management, and fleet configuration.",
    ready:["Write a fully idempotent role and prove it by running it twice","Use Ansible Vault to manage secrets safely","Roll out a config change to 50 servers with staged rollout and auto-stop on failure"]
  },

  {
    id:"secrets_mgmt", label:"Secrets Management", phase:"platform",
    title:"Secrets management and configuration security",
    why:"Secrets (API keys, DB passwords, TLS certs) are the single most common source of security breaches in DevOps environments. Every tool in this roadmap handles secrets — you need a systematic approach before you build anything that touches production.",
    badges:[{t:"Platform",c:"b-platform"}],
    prereqs:["Kubernetes — secrets live in clusters and must be securely injected","CI/CD tools (GitHub Actions, Jenkins, or GitLab) — pipelines need secrets to deploy","Cloud IAM (AWS/Azure/GCP) — cloud secrets tie into IAM roles"],
    stages:[
      {label:"Beginner",items:["What a secret is vs a config value: the distinction matters","Kubernetes Secrets: base64 is encoding, not encryption — the risk","Environment variables as the standard injection mechanism","GitHub Actions / GitLab CI built-in secrets stores","AWS Secrets Manager and Parameter Store basics","The golden rule: secrets never in git, ever, including .env files"]},
      {label:"Intermediate",items:["HashiCorp Vault: architecture, engines (KV, PKI, database), policies","Dynamic credentials: Vault generates DB passwords per-request with TTL","Vault agent and sidecar injection for Kubernetes","External Secrets Operator (ESO): sync Vault/AWS/GCP secrets to K8s Secrets","SOPS: encrypt secrets at rest in git using KMS or age","Secret rotation: how to rotate without downtime"]},
      {label:"Advanced",items:["Zero static credentials architecture: OIDC + Workload Identity everywhere","Vault PKI secrets engine: internal CA, automatic cert issuance and renewal","Audit logging: every secret access is logged — Vault audit backend","Seal/unseal and high availability for Vault clusters","Secret sprawl detection: scanning git history and cloud resources for leaked secrets","Compliance: SOC2/PCI requirements around secret management and rotation"]}
    ],
    projects:["Set up HashiCorp Vault: enable KV engine, write a policy, authenticate a Kubernetes pod via Vault agent","Configure External Secrets Operator to sync an AWS Secrets Manager secret into a Kubernetes Secret","Encrypt a secrets file with SOPS + AWS KMS and commit it safely to git — decrypt in CI pipeline","Audit an existing project for secret sprawl: scan git history with truffleHog, find and remediate any exposed secrets"],
    usecases:["Pod needs database credentials: Vault agent injects dynamic credentials with 1-hour TTL — no static passwords","CI pipeline authenticates to AWS via OIDC: zero AWS access keys stored anywhere","Automated TLS certificate rotation via Vault PKI: certs renewed before expiry with no human involvement"],
    mistakes:["Treating base64 Kubernetes Secrets as encrypted — they are not","Hardcoding secrets in Dockerfiles, Helm values, or Terraform — they end up in state files and image history","Not rotating secrets after an engineer leaves the company","Using a single long-lived Vault token for everything — use short-lived, least-privilege tokens per workload","Skipping secret scanning in CI — leaked secrets reach git history and stay there forever"],
    production:"Zero static credentials is the production standard. Every credential is dynamic, short-lived, and tied to a workload identity. Static keys are a compliance violation waiting to become a breach.",
    ready:["Implement Vault agent sidecar injection for a Kubernetes pod with zero static secrets","Explain why Kubernetes Secrets are not encrypted at rest by default and how to fix it (etcd encryption + ESO)","Rotate a database password without any service downtime","Scan a git repository for secrets and remediate any findings"]
  },

  /* ════════════════════════════════════════════════════════════════
     PHASE 3: CLOUD
  ════════════════════════════════════════════════════════════════ */
  {
    id:"aws", label:"AWS", phase:"cloud",
    title:"Amazon Web Services (AWS)",
    why:"AWS is the dominant cloud platform. Most DevOps job descriptions list it first. Learn the core services deeply before spreading to Azure and GCP.",
    badges:[{t:"Cloud",c:"b-cloud"}],
    prereqs:["Linux and networking — cloud is just someone else's Linux servers","Docker/Kubernetes — most AWS services run or orchestrate containers","Bash — AWS CLI is used from shell scripts"],
    stages:[
      {label:"Beginner",items:["IAM: users, groups, roles, policies — least privilege from day one","EC2: launch, security groups, key pairs, AMIs","S3: buckets, objects, static hosting, versioning","VPC: subnets, route tables, internet gateway","RDS: managed databases, multi-AZ","Route 53: DNS, health checks"]},
      {label:"Intermediate",items:["EKS: managed Kubernetes, node groups, Fargate","ECS: task definitions, services, load balancer integration","ALB/NLB: target groups, path-based routing, SSL termination","Lambda: event-driven functions, triggers, layers","CloudWatch: metrics, alarms, log groups, dashboards","Auto Scaling Groups: launch templates, scaling policies"]},
      {label:"Advanced",items:["IAM Roles for Service Accounts (IRSA) — no static keys in pods","AWS Organizations: SCPs, OUs for multi-account strategy","Transit Gateway and PrivateLink for private connectivity","AWS Config and Security Hub for compliance","Savings Plans and Cost Explorer for FinOps","EventBridge for event-driven architectures","SQS/SNS for decoupled async workloads"]}
    ],
    projects:["Build a VPC from scratch: public/private subnets, NAT gateway, bastion host","Deploy a containerized app on EKS with ALB Ingress and IRSA","Set up CloudWatch alarms for CPU, memory, and custom metrics","Implement cross-account access using IAM role assumption"],
    usecases:["IRSA gives K8s pods AWS permissions without any long-lived keys","Multi-account org: prod, staging, dev, security, logging accounts separate","CloudWatch Logs Insights for querying application logs during incidents"],
    mistakes:["Creating IAM users with access keys instead of roles","Leaving ports open in security groups (0.0.0.0/0 on port 22)","Ignoring egress costs — outbound data transfer is expensive","Not using Savings Plans — 30-40% savings left on the table"],
    production:"AWS is where most production workloads live. EKS, RDS, ALB, CloudWatch, S3, and IAM are used in every production AWS environment.",
    ready:["Design a 3-tier VPC without consulting documentation","Explain IRSA and implement it for a pod that needs S3 access","Set up a multi-AZ RDS with automated failover and a read replica","Calculate and implement a Savings Plan for a given workload"]
  },

  {
    id:"azure", label:"Azure", phase:"cloud",
    title:"Microsoft Azure",
    why:"Azure dominates enterprise and government markets. Many orgs run hybrid: Azure AD for identity, AWS or GCP for compute. AKS is a first-class Kubernetes platform.",
    badges:[{t:"Cloud",c:"b-cloud"}],
    prereqs:["AWS fundamentals — Azure concepts map across but naming differs","Kubernetes — AKS is Azure's managed K8s"],
    stages:[
      {label:"Beginner",items:["Azure AD/Entra: users, groups, service principals, managed identities","Resource Groups, Subscriptions, Management Groups","Virtual Networks, NSGs, subnets","Azure VM, disk types, availability sets","Azure Blob Storage, containers, access tiers","Azure SQL, Cosmos DB basics"]},
      {label:"Intermediate",items:["AKS: node pools, cluster autoscaler, Azure CNI","Azure Container Registry (ACR): push, pull, geo-replication","Azure DevOps: pipelines, repos, boards, artifacts","App Service and Container Apps for PaaS deployments","Azure Key Vault: secrets, certificates, managed identity access","Azure Monitor: metrics, log analytics workspace, alerts"]},
      {label:"Advanced",items:["Managed Identity: system-assigned and user-assigned","Private Endpoints for PaaS services","Azure Policy for governance and compliance","Azure Front Door and Traffic Manager for global routing","Entra Workload Identity Federation for CI/CD (no secrets)","Landing Zone architecture: hub-spoke networking"]}
    ],
    projects:["Deploy an AKS cluster with Workload Identity and access Key Vault from a pod","Build an Azure DevOps pipeline that builds, pushes to ACR, and deploys to AKS","Set up Log Analytics workspace and query application logs with KQL","Implement Azure Policy to enforce tagging on all resources"],
    usecases:["Enterprise SSO: Azure AD as identity provider for every internal tool","AKS + Azure DevOps as a complete end-to-end platform for .NET teams","Azure Workload Identity replacing service principal client secrets in CI"],
    mistakes:["Using service principal client secrets instead of Managed Identity","Ignoring NSG rules — Azure doesn't have security groups like AWS, it has NSGs at subnet AND NIC level","Not understanding the subscription/resource group hierarchy"],
    production:"Azure is the platform of choice for Microsoft-stack enterprises. If your employer uses M365, there's a high probability they run Azure.",
    ready:["Deploy to AKS using Workload Identity (no secrets anywhere in the pipeline)","Write KQL queries to find application errors in Log Analytics","Design an Azure landing zone with hub-spoke network topology"]
  },

  {
    id:"gcp", label:"GCP", phase:"cloud",
    title:"Google Cloud Platform (GCP)",
    why:"GCP leads in analytics (BigQuery), ML/AI workloads, and has the best Kubernetes implementation (GKE) since Google invented Kubernetes. Strong in data engineering orgs.",
    badges:[{t:"Cloud",c:"b-cloud"}],
    prereqs:["AWS fundamentals — GCP maps across with different naming","Kubernetes — GKE is GCP's crown jewel"],
    stages:[
      {label:"Beginner",items:["Projects, folders, organizations hierarchy","IAM: service accounts, roles, workload identity federation","GCE: VM instances, machine types, images","GCS: buckets, storage classes, lifecycle rules","Cloud SQL, Cloud Spanner basics","VPC, subnets, firewall rules"]},
      {label:"Intermediate",items:["GKE: autopilot vs standard mode, node pools, Workload Identity","Artifact Registry for container images","Cloud Build: CI/CD pipeline, triggers","Cloud Run: serverless containers","Pub/Sub: event-driven messaging","Cloud Monitoring, Cloud Logging, Cloud Trace"]},
      {label:"Advanced",items:["BigQuery for operational analytics","Workload Identity Federation for GitHub Actions (no service account keys)","Shared VPC for multi-project networking","VPC Service Controls for data exfiltration prevention","Cloud Armor for WAF and DDoS protection","Anthos for multi-cloud and hybrid"]}
    ],
    projects:["Deploy to GKE using Workload Identity Federation from GitHub Actions","Set up a Cloud Build pipeline that builds, pushes to Artifact Registry, deploys to Cloud Run","Query application logs in BigQuery using Log Sink","Implement VPC Service Controls to restrict GCS access to specific projects"],
    usecases:["GKE Autopilot: zero node management, scale to zero, pay per pod","BigQuery: query 10TB of application logs in under 10 seconds","Pub/Sub for event-driven microservice communication at Google scale"],
    mistakes:["Using service account key files — GCP Workload Identity Federation eliminates this need","Not using GKE Autopilot for new clusters — it's operationally simpler and often cheaper","Ignoring BigQuery for log analytics — it's significantly cheaper than Elasticsearch at scale"],
    production:"GCP is the platform for data-heavy, ML-heavy, and Kubernetes-native orgs. GKE is arguably the best managed K8s service available.",
    ready:["Explain the difference between GKE Standard and Autopilot","Deploy to GKE without a service account key file using Workload Identity","Use BigQuery to query and analyze application logs"]
  },

  /* ════════════════════════════════════════════════════════════════
     PHASE 4: OBSERVABILITY
  ════════════════════════════════════════════════════════════════ */
  {
    id:"sre_fundamentals", label:"SRE Fundamentals", phase:"observability",
    title:"SRE principles: SLIs, SLOs, SLAs, and error budgets",
    why:"Site Reliability Engineering is a discipline, not a job title for someone who runs Kubernetes. Without understanding SLIs, SLOs, error budgets, and the toil reduction framework, you are doing reactive ops — not SRE. This is the mental model that gives everything in observability its purpose.",
    badges:[{t:"Observability",c:"b-observability"},{t:"SRE",c:"b-sre"}],
    prereqs:["Kubernetes — you need running services to define reliability for","Prometheus basics helpful — SLIs are measured via metrics","Production exposure — SRE concepts without production context are purely theoretical"],
    stages:[
      {label:"Beginner",items:["SLI (Service Level Indicator): a precise measurement of service behavior (e.g., % requests < 200ms)","SLO (Service Level Objective): internal reliability target (e.g., 99.9% over 28-day window)","SLA (Service Level Agreement): contractual external commitment — always weaker than SLO","Error budget: 100% minus SLO target — the remaining budget for risk-taking","The reliability vs velocity trade-off: error budget makes it quantifiable","Availability calculation: (uptime / total time) × 100 — and why uptime is a bad SLI"]},
      {label:"Intermediate",items:["Multi-window, multi-burn-rate alerting: fast burn for urgent, slow burn for trending","Error budget policy: what happens when budget is exhausted (freeze releases, reliability sprints)","Toil definition: manual, repetitive, automatable work that scales with service load","Toil measurement: tracking % of engineering time spent on toil vs project work","Blameless postmortems: systems thinking over blame, 5-whys, action items with owners","Choosing meaningful SLIs: availability, latency (P99), quality, throughput — not CPU%"]},
      {label:"Advanced",items:["SLO as an organizational contract: product, engineering, and business alignment","Error budget burn rate dashboards and automated release gates based on SLO health","Reliability roadmap: using postmortem patterns to prioritize engineering investment","Incident command structure: IC, comms lead, scribe — not everyone on the same call doing the same thing","Chaos engineering as SLO validation: does your service hold its SLO under failure?","Eliminating toil: runbook-to-automation pipeline, measuring toil reduction quarter over quarter"]}
    ],
    projects:["Define SLIs and SLOs for a real web service you run: document measurement method, target, and error budget in a spec","Build a 28-day rolling availability dashboard in Grafana using Prometheus — visualize error budget consumed and remaining","Write an error budget policy document: what triggers a release freeze, what triggers a reliability sprint, who owns the decision","Conduct a blameless postmortem for a past incident (real or simulated): timeline, contributing factors, 5 action items with owners and due dates"],
    usecases:["Product manager wants to add a feature that risks 0.1% error rate increase — error budget tells you if you can afford it","On-call receives 200 alerts per week — SRE principles help reduce to 12 meaningful, actionable alerts","Engineering team prioritizes reliability roadmap using postmortem pattern analysis — not gut feel"],
    mistakes:["Setting SLOs at 100% — impossible, wastes error budget on unavoidable noise, and removes any space for deployment risk","Treating SLO as an ops metric instead of a product contract — it must involve product and business teams","Writing postmortems that sit in a doc and are never acted on — action item completion rate is itself a reliability metric","Confusing SLA (what you promise customers) with SLO (internal target) — SLO must be stricter to protect SLA","Alerting on resource saturation (CPU > 80%) instead of user-facing symptoms (error rate > 1%)"],
    production:"SRE is the discipline of applying software engineering to operations problems. Every SRE role interview will ask you to define SLIs, SLOs, and error budgets for a service. These concepts also inform how you design alerts, write postmortems, and prioritize reliability work.",
    ready:["Define correct SLIs for an API service — explain why CPU% is a bad SLI","Calculate the error budget for a 99.9% SLO over 30 days in minutes","Write a blameless postmortem with a root cause analysis and at least 3 actionable items with owners","Explain error budget burn rate and how multi-window alerting detects both fast and slow budget exhaustion"]
  },

  {
    id:"prometheus", label:"Prometheus", phase:"observability",
    title:"Prometheus (metrics and alerting)",
    why:"Prometheus is the standard for metrics in cloud-native environments. Kubernetes exposes Prometheus metrics natively. Every Helm chart has a Prometheus integration. AlertManager is how alerts get routed to PagerDuty.",
    badges:[{t:"Observability",c:"b-observability"}],
    prereqs:["Kubernetes — Prometheus runs in K8s and scrapes K8s metrics","Linux — understanding resource metrics requires OS knowledge","Networking — Prometheus uses HTTP to scrape endpoints"],
    stages:[
      {label:"Beginner",items:["Metrics types: Counter, Gauge, Histogram, Summary","Prometheus data model: metrics + labels","PromQL basics: rate(), sum(), by(), without()","Scrape config: static configs, service discovery","AlertManager: routes, receivers, inhibitions","Grafana datasource: connecting Prometheus to dashboards"]},
      {label:"Intermediate",items:["Kubernetes service discovery: pod, service, node annotations","Recording rules for expensive query pre-computation","Multi-window multi-burn-rate alerting for SLOs","Remote write to long-term storage: Thanos, Cortex, Mimir","Cardinality management: high cardinality = performance killer","kube-state-metrics and node-exporter — the two mandatory exporters"]},
      {label:"Advanced",items:["Prometheus federation for multi-cluster setups","Thanos for global view and long-term retention","Exemplars for linking metrics to traces","Writing custom exporters in Python or Go","Prometheus operator: PrometheusRule, ServiceMonitor, PodMonitor CRDs","Alert fatigue reduction: alert on symptoms, not causes"]}
    ],
    projects:["Deploy kube-prometheus-stack via Helm: get full cluster observability in 10 minutes","Write PromQL to detect a service's error rate exceeding 1% over 5 minutes","Create a multi-burn-rate SLO alert: fast burn + slow burn for a production service","Write an AlertManager config that routes database alerts to DBAs, app alerts to devs"],
    usecases:["Detecting P99 latency regression before customers report it","SLO dashboard showing error budget remaining for the month","AlertManager routing: SEV1 → PagerDuty, warnings → Slack only"],
    mistakes:["Creating alerts on every metric that exists — alert fatigue kills on-call","Not setting recording rules — dashboard loads slow and Prometheus strains under load","High cardinality labels like user_id or request_id — metric explosion","Alerting on causes (CPU > 80%) instead of symptoms (error rate > 1%)"],
    production:"Every production Kubernetes cluster runs Prometheus. Every SRE writes PromQL. Every alert goes through AlertManager. This is non-negotiable observability infrastructure.",
    ready:["Write PromQL to calculate the error rate, latency P99, and request rate for a service","Create an SLO alert with multi-burn-rate rules","Design an AlertManager routing tree for a 5-team engineering org"]
  },

  {
    id:"grafana", label:"Grafana", phase:"observability",
    title:"Grafana (dashboards and visualization)",
    why:"Prometheus stores metrics; Grafana makes them visible and actionable. Good dashboards reduce incident detection time from hours to seconds. Bad dashboards cause outages.",
    badges:[{t:"Observability",c:"b-observability"}],
    prereqs:["Prometheus — Grafana is useless without a datasource","PromQL — you write queries inside Grafana panels"],
    stages:[
      {label:"Beginner",items:["Dashboard basics: panels, rows, variables","Panel types: graph, stat, gauge, table, heatmap","Template variables for dynamic dashboards (env, namespace, service)","Time range controls and refresh intervals","Grafana alerts (basic): thresholds on panels","Datasource configuration: Prometheus, Loki, CloudWatch"]},
      {label:"Intermediate",items:["Dashboard-as-code: Grafonnet or Jsonnet + Grizzly","Grafana provisioning: dashboards and datasources via configmaps","Transformations: merge, filter, group by in the UI","Mixed datasources in one panel","Grafana Alerting (unified): alerting rules, contact points, notification policies","Annotations for marking deployments and incidents on graphs"]},
      {label:"Advanced",items:["Grafana as code at scale: managing 100+ dashboards in git","Grafana OnCall for on-call scheduling and escalations","Synthetic monitoring with Grafana Cloud k6","Correlation: link from metrics panel to logs (Loki) and traces (Tempo)","Custom plugins: when built-in panels don't fit","SLO dashboards with error budget burn rate panels"]}
    ],
    projects:["Build a complete service dashboard: request rate, error rate, P50/P95/P99 latency, saturation","Create a Kubernetes cluster overview: node CPU/memory, pod restarts, PVC usage","Build a SLO dashboard: availability SLI, error budget remaining, burn rate over 30 days","Export a dashboard as JSON, commit to git, provision it via Kubernetes ConfigMap"],
    usecases:["Incident response: first thing opened during an incident — Grafana dashboard","Deployment annotation: visible line on every graph showing exactly when deploy happened","Business review: Grafana dashboard showing SLA compliance to non-technical stakeholders"],
    mistakes:["Building dashboards full of metrics no one looks at — every panel should answer a question","Not using template variables — one dashboard per environment instead of one dashboard for all","Not versioning dashboards in git — they get changed and there's no rollback","Auto-refresh too aggressive — hammers Prometheus with queries"],
    production:"Grafana is the observability UI for most cloud-native orgs. It replaces Datadog for teams that want to own their stack. Every major incident response starts by looking at Grafana.",
    ready:["Build a service dashboard that an on-call engineer could use to diagnose a P99 latency spike","Provision dashboards via Kubernetes ConfigMaps — no manual clicking","Design and build an SLO dashboard with error budget tracking for a production service"]
  },

  {
    id:"elk", label:"ELK Stack", phase:"observability",
    title:"ELK Stack (Elasticsearch, Logstash, Kibana)",
    why:"Logs are the third pillar of observability. ELK is the most widely deployed log management platform. When Prometheus/Grafana show an error rate spike, you go to Kibana to find why.",
    badges:[{t:"Observability",c:"b-observability"}],
    prereqs:["Linux — you need to understand log formats and paths","Kubernetes — most logs in modern environments come from pods","Prometheus/Grafana — logs complement metrics; learn metrics first"],
    stages:[
      {label:"Beginner",items:["Elasticsearch: indices, documents, shards, replicas","Kibana: Discover for searching logs, dashboards","Query DSL basics: match, term, range, bool","Index lifecycle management (ILM): hot → warm → cold → delete","Filebeat for log shipping from Linux hosts","Logstash basics: input, filter (grok, mutate), output"]},
      {label:"Intermediate",items:["Fluent Bit as a lightweight, Kubernetes-native log shipper","Structured logging: why JSON logs beat unstructured text","Index templates and mappings for consistent schema","Kibana Lens for advanced visualizations","Kibana Alerting: detect error patterns and notify","Log parsing: grok patterns, dissect, KV filter in Logstash"]},
      {label:"Advanced",items:["Elasticsearch cluster: node roles, allocation rules, shard sizing","Cross-cluster search and replication","ELK on Kubernetes: ECK (Elastic Cloud on Kubernetes)","APM server for application performance monitoring","Cost management: ILM tiers, frozen indices, Loki as ELK replacement","Correlation IDs: trace a request across 10 microservices via a single ID in logs"]}
    ],
    projects:["Deploy ELK on Kubernetes using ECK, collect logs from all pods via Fluent Bit","Write a grok pattern to parse nginx access logs and extract method, path, status, duration","Build a Kibana dashboard: requests/min, error rate by endpoint, top 10 slowest paths","Set up ILM to move logs hot → warm after 7 days, delete after 30 days"],
    usecases:["Incident forensics: 'find all errors for user X between 14:00 and 15:00 yesterday'","Detecting anomalous patterns before they become incidents","Compliance: retain audit logs for 1 year, query them for access reviews"],
    mistakes:["Storing all logs with the same retention policy — logs are not equal in value","No structured logging — searching unstructured logs at scale is painful","Shard over-allocation: one index per day per service = thousands of shards = cluster death","Using Logstash for simple log forwarding — Fluent Bit is lighter and faster for that job"],
    production:"ELK (or its replacement Loki+Grafana for lower cost) is how you answer 'what happened?' during and after incidents. It's one-third of the observability stack.",
    ready:["Search and filter logs in Kibana to trace a production incident through multiple services","Design an ILM policy balancing retention requirements and storage costs","Ship structured logs from a Kubernetes app to Elasticsearch with no log data loss"]
  },

  /* ════════════════════════════════════════════════════════════════
     PHASE 5: SCRIPTING
  ════════════════════════════════════════════════════════════════ */
  {
    id:"python", label:"Python", phase:"scripting",
    title:"Python scripting for DevOps",
    why:"Python is what you reach for when bash hits its limits. AWS SDK (boto3), Kubernetes client, Prometheus client, REST API automation, custom exporters — all Python. The most important scripting language in DevOps after bash.",
    badges:[{t:"Scripting",c:"b-scripting"}],
    prereqs:["Bash scripting — you'll compare and contrast constantly","At least one cloud platform — boto3 requires AWS knowledge","REST APIs — Python is used heavily for API automation"],
    stages:[
      {label:"Beginner",items:["Data types: str, int, list, dict, tuple, set","Control flow: if/elif/else, for, while","Functions, args, kwargs, return values","File I/O: reading/writing files, CSV","Exception handling: try/except/finally","Common stdlib: os, sys, pathlib, subprocess, json, argparse"]},
      {label:"Intermediate",items:["boto3: AWS SDK — EC2, S3, EKS, Lambda automation","requests: HTTP client for REST API automation","YAML/JSON parsing: PyYAML, json module","Kubernetes Python client: list pods, patch deployments, watch events","Logging module: structured logs from Python scripts","Virtual environments: venv, requirements.txt, pip-tools"]},
      {label:"Advanced",items:["Click or argparse for production-grade CLI tools","asyncio for concurrent API calls (not blocking on slow APIs)","prometheus_client: write a custom exporter","Kubernetes operator pattern using kopf or operator-sdk Python","Testing: pytest, mocking boto3 with moto","Docker SDK: automate container lifecycle from Python","Packaging: setup.py, pyproject.toml, publishing to internal Nexus PyPI"]}
    ],
    projects:["Write a boto3 script that finds all EC2 instances not tagged 'Environment' and reports them","Build a Python CLI tool that generates a Kubernetes deployment YAML from a template","Write a custom Prometheus exporter for a legacy app that has no metrics endpoint","Automate GitHub: use PyGithub to open PRs with Terraform plan output as a comment"],
    usecases:["Custom Prometheus exporter for an internal service that has no built-in metrics","boto3 automation: snapshot all EBS volumes older than 30 days","Kubernetes event watcher: alert on OOMKill events in Slack"],
    mistakes:["Writing Python like bash — no functions, no structure, no error handling","Not using virtual environments — global pip installs break other tools","Catching bare Exception without logging what actually failed","Synchronous boto3 calls in a loop — brutally slow, use concurrent.futures or asyncio"],
    production:"Python automates everything bash can't: cloud APIs, Kubernetes operations, custom monitoring, and operational tooling. Every SRE team has a Python toolkit.",
    ready:["Write a boto3 script with proper error handling, logging, and CLI argument parsing","Build a custom Prometheus exporter that exposes at least 3 meaningful metrics","Automate a Kubernetes operation — scale deployments, find and report failing pods — without using kubectl"]
  }

]; /* end TOPICS */