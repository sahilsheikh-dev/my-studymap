const PHASE_ORDER = ["overview","foundation","java_core","backend","databases","system_design","devops","testing","projects","interviews"];
const PHASE_LABELS = {
  overview:      "Start here",
  foundation:    "Phase 1: CS Fundamentals",
  java_core:     "Phase 2: Java Mastery",
  backend:       "Phase 3: Backend & APIs",
  databases:     "Phase 4: Databases",
  system_design: "Phase 5: System Design",
  devops:        "Phase 6: DevOps Awareness",
  testing:       "Phase 7: Testing & Security",
  projects:      "Phase 8: Projects",
  interviews:    "Phase 9: Interview Prep"
};

const TOPICS = [

  /* ── OVERVIEW ── */
  {
    id:"overview", label:"Overview", phase:"overview",
    title:"Java Developer Mastery Blueprint",
    why:"A complete, no-nonsense framework from absolute beginner to production-grade Java Engineer. Every section is sequenced deliberately — skip nothing in Phase 1, rush nothing in Phase 2.",
    badges:[], content:"overview"
  },

  /* ════════════════════════════
     PHASE 1: CS FUNDAMENTALS
  ════════════════════════════ */
  {
    id:"programming_basics", label:"Programming Basics", phase:"foundation",
    title:"Programming fundamentals and computational thinking",
    why:"You cannot write good Java without understanding what a program actually is. Variables, control flow, and functions are not Java-specific — they are universal. Learn them language-agnostically before Java syntax muddies the water.",
    badges:[{t:"Foundation",c:"b-foundation"}],
    prereqs:["Nothing. This is the starting point."],
    stages:[
      {label:"Beginner",items:[
        "Variables and data types: what they are, why they exist, primitive vs reference",
        "Operators: arithmetic, comparison, logical, bitwise — and operator precedence",
        "Control flow: if/else, switch — branching logic and why conditions matter",
        "Loops: for, while, do-while — iteration, when to use each",
        "Functions/methods: parameters, return values, void — the unit of reuse",
        "Scope: local vs global variables, why scope prevents bugs",
        "Input and output: reading user input, printing to console"
      ]},
      {label:"Intermediate",items:[
        "Arrays: fixed-size, indexed, traversal, multi-dimensional arrays",
        "Recursion: base case, recursive case, call stack mental model",
        "Strings: immutability concept, common operations, character arrays",
        "Error handling concept: what exceptions are before the Java-specific syntax",
        "Pseudocode and flowcharts: designing before coding",
        "Debugging basics: reading stack traces, print debugging, mental model execution"
      ]},
      {label:"Advanced",items:[
        "Bit manipulation: AND, OR, XOR, NOT, shifts — why it matters for performance",
        "Pass by value vs pass by reference — Java-specific trap that causes real bugs",
        "Short-circuit evaluation: && vs & in conditionals — subtle but important",
        "Integer overflow and underflow — real production bugs from this",
        "Floating point precision: why 0.1 + 0.2 != 0.3 and what to do about it"
      ]}
    ],
    projects:[
      "FizzBuzz — but explain why each construct you use is the right choice",
      "Calculator that handles division by zero and non-numeric input gracefully",
      "Simple grade calculator with loops, conditionals, and a summary report",
      "Fibonacci sequence: iterative vs recursive — measure performance difference"
    ],
    usecases:[
      "Every production bug trace starts with understanding control flow",
      "Integer overflow caused the Ariane 5 rocket explosion — this is not academic",
      "Pass-by-value confusion is the #1 cause of subtle Java bugs in junior code"
    ],
    mistakes:[
      "Learning syntax before logic — results in cargo-cult programming",
      "Skipping pseudocode — jumping to IDE before thinking causes spaghetti code",
      "Treating recursion as magic — understand the call stack or you will cause StackOverflow in prod"
    ],
    production:"Programming fundamentals are the ceiling of your career. A weak foundation is visible in every code review you ever produce.",
    ready:[
      "Write any algorithm in pseudocode before touching the keyboard",
      "Explain pass-by-value vs pass-by-reference in Java with a concrete example",
      "Identify and fix an integer overflow bug in a code snippet",
      "Trace through a recursive function manually on paper"
    ]
  },

  {
    id:"oop", label:"OOP", phase:"foundation",
    title:"Object-Oriented Programming principles",
    why:"Java is an OOP language. Every framework, every library, every pattern you use is built on these four concepts. Get them wrong and your code will be unmaintainable at any scale.",
    badges:[{t:"Foundation",c:"b-foundation"}],
    prereqs:["Programming basics — variables, functions, control flow"],
    stages:[
      {label:"Beginner",items:[
        "Classes and objects: blueprint vs instance — the mental model that everything else builds on",
        "Fields and methods: state vs behavior",
        "Constructors: default, parameterized, constructor chaining",
        "The 'this' keyword: disambiguating field from parameter",
        "Access modifiers: private, protected, public, package-private — why encapsulation matters",
        "Encapsulation: getters, setters, and why direct field access is dangerous"
      ]},
      {label:"Intermediate",items:[
        "Inheritance: extends, method overriding, the 'super' keyword",
        "Polymorphism: compile-time (overloading) vs runtime (overriding)",
        "Abstract classes: partial implementation, forcing subclass completion",
        "Interfaces: contract definition, why Java uses them instead of multiple inheritance",
        "The Liskov Substitution Principle: if your subclass breaks the parent contract, inheritance is wrong",
        "Composition vs inheritance: 'has-a' beats 'is-a' in most real-world cases"
      ]},
      {label:"Advanced",items:[
        "SOLID principles: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion",
        "Design by contract: preconditions, postconditions, invariants",
        "The fragile base class problem: why deep inheritance hierarchies collapse",
        "Favor interfaces over abstract classes: why Spring and every major framework does this",
        "Immutable objects: why they are thread-safe by definition",
        "Object identity vs equality: == vs .equals() and why hashCode must be consistent"
      ]}
    ],
    projects:[
      "Model a bank account: Account, SavingsAccount, CheckingAccount — demonstrate inheritance and polymorphism correctly",
      "Redesign the same bank account using composition instead of inheritance — argue the trade-offs",
      "Build a shape hierarchy: Shape interface, Circle, Rectangle, Triangle — calculate areas polymorphically",
      "Design a Vehicle system that violates SOLID, then refactor it to comply — document what changed and why"
    ],
    usecases:[
      "Spring's entire dependency injection is built on the Dependency Inversion Principle",
      "Every Hibernate entity is a class with annotations — understanding OOP makes JPA non-magic",
      "The Strategy pattern (heavily used in production) is just runtime polymorphism with a name"
    ],
    mistakes:[
      "Overusing inheritance — the most common OOP mistake; composition is almost always the right answer",
      "Making everything public — destroying encapsulation for 'convenience'",
      "Ignoring equals() and hashCode() — putting objects in HashSets that behave incorrectly",
      "Treating SOLID as rules to memorize instead of principles to reason from"
    ],
    production:"Every Spring component, every JPA entity, every design pattern is OOP applied. Weak OOP means weak Spring, weak patterns, weak system design.",
    ready:[
      "Explain the difference between overloading and overriding without hesitation",
      "State a specific scenario where composition beats inheritance and implement it",
      "Implement equals() and hashCode() correctly for a class with 3 fields",
      "Walk through each SOLID principle with a real-world Java violation and fix"
    ]
  },

  {
    id:"dsa", label:"Data Structures & Algorithms", phase:"foundation",
    title:"Data structures, algorithms, and complexity",
    why:"DSA is the only topic that separates engineers who can solve novel problems from those who cannot. Every senior interview tests it. More importantly, choosing the wrong data structure in production causes real latency and cost.",
    badges:[{t:"Foundation",c:"b-foundation"}],
    prereqs:["OOP — many data structures are classes in Java","Programming basics — recursion, loops"],
    stages:[
      {label:"Beginner",items:[
        "Big-O notation: O(1), O(log n), O(n), O(n log n), O(n²) — and how to calculate it",
        "Arrays and ArrayList: when to use, time complexity of operations",
        "LinkedList: singly vs doubly, when it beats ArrayList (spoiler: rarely in Java)",
        "Stack and Queue: LIFO vs FIFO, use cases, Deque in Java",
        "HashMap and HashSet: how hashing works, collision handling, O(1) average ops",
        "Sorting: Bubble, Selection, Insertion — understand why they are slow before memorizing fast ones"
      ]},
      {label:"Intermediate",items:[
        "Binary search: O(log n), requires sorted input — implement from memory",
        "Trees: binary tree, BST — insert, search, delete, traversals (in/pre/post order)",
        "Heaps/PriorityQueue: O(log n) insert/extract-min, use in scheduling and top-K problems",
        "Graphs: adjacency list vs matrix, BFS, DFS — why graphs model almost every real system",
        "Merge sort and quicksort: O(n log n), divide and conquer — understand the pivot problem",
        "Two pointers, sliding window patterns: optimize O(n²) brute force to O(n)",
        "Space complexity: auxiliary space vs total space"
      ]},
      {label:"Advanced",items:[
        "Dynamic programming: memoization vs tabulation, identifying optimal substructure",
        "Trie: prefix trees for autocomplete, dictionary problems",
        "Disjoint Set/Union-Find: cycle detection, connected components",
        "Segment trees and Fenwick trees: range queries — used in real-time analytics systems",
        "Topological sort: dependency resolution in build systems and task schedulers",
        "Amortized analysis: why ArrayList.add() is O(1) amortized despite occasional O(n) resize"
      ]}
    ],
    projects:[
      "Implement HashMap from scratch: array of buckets, linked list chaining, resize on load factor",
      "Build a task scheduler using a min-heap PriorityQueue with priority + deadline",
      "Solve 50 LeetCode problems: 20 easy, 20 medium, 10 hard — categorized by pattern",
      "Implement BFS on a graph to find shortest path in an unweighted graph — apply to a maze problem"
    ],
    usecases:[
      "Database query planners are graph traversal problems — understanding graphs explains SQL optimization",
      "Redis sorted sets use skip lists — a probabilistic data structure",
      "Kafka partition assignment uses consistent hashing — a hash ring data structure",
      "Autocomplete in every search box is a trie or prefix-based index"
    ],
    mistakes:[
      "Memorizing solutions without understanding patterns — fails on novel problems",
      "Ignoring space complexity — memory leaks in production from this",
      "Using LinkedList in Java for performance — ArrayList beats it in almost all cases due to cache locality",
      "Not practicing on a timer — interview DSA is time-constrained"
    ],
    production:"The day you pick HashMap vs TreeMap, ArrayList vs LinkedList, or PriorityQueue vs a sorted list is the day DSA pays off. Wrong choice = production latency.",
    ready:[
      "Implement binary search from memory — no bugs on the first try",
      "Given a problem, identify the optimal data structure and justify your choice with complexity",
      "Solve a medium LeetCode graph problem using BFS in under 25 minutes",
      "Explain why HashMap is O(1) average and O(n) worst case"
    ]
  },

  {
    id:"memory_concurrency", label:"Memory & Concurrency Basics", phase:"foundation",
    title:"Memory management and concurrency fundamentals",
    why:"Java manages memory via the JVM but you must understand it to avoid memory leaks, OutOfMemoryError, and data races. Concurrency is unavoidable in backend systems — every web server handles multiple threads simultaneously.",
    badges:[{t:"Foundation",c:"b-foundation"}],
    prereqs:["OOP — objects are what live in memory","Programming basics"],
    stages:[
      {label:"Beginner",items:[
        "Stack vs heap: local variables vs object allocation",
        "References vs values: what a Java variable actually holds",
        "Garbage collection concept: reachability, strong references",
        "Process vs thread: one process, multiple threads sharing the heap",
        "Thread creation: Thread class, Runnable interface",
        "Race condition concept: two threads modifying shared state"
      ]},
      {label:"Intermediate",items:[
        "synchronized keyword: mutual exclusion on an object's monitor",
        "volatile keyword: visibility guarantee without mutual exclusion",
        "Thread lifecycle: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED",
        "Deadlock: four conditions, how to detect, how to prevent",
        "wait(), notify(), notifyAll(): low-level thread coordination",
        "Thread pools: why creating threads is expensive, Executor framework"
      ]},
      {label:"Advanced",items:[
        "Java Memory Model (JMM): happens-before relationship — the formal guarantee behind volatile and synchronized",
        "java.util.concurrent: ReentrantLock, Semaphore, CountDownLatch, CyclicBarrier",
        "Lock-free data structures: CAS (Compare-And-Swap), AtomicInteger, AtomicReference",
        "ThreadLocal: per-thread state, use in Spring request-scoped context — and the memory leak trap",
        "ExecutorService: shutdown vs shutdownNow, Future, CompletableFuture",
        "ForkJoinPool: work-stealing, parallel streams use this under the hood"
      ]}
    ],
    projects:[
      "Producer-consumer problem: BlockingQueue, two threads, demonstrate no data loss",
      "Demonstrate a deadlock: create it deliberately, then fix it with lock ordering",
      "Thread-safe counter: compare synchronized, AtomicInteger, and ReentrantLock for throughput",
      "CompletableFuture pipeline: call 3 external APIs in parallel, combine results, timeout on slow ones"
    ],
    usecases:[
      "Every Spring MVC request runs in a separate thread — ThreadLocal stores request context",
      "Connection pools (HikariCP) manage thread-safe resource acquisition under high concurrency",
      "Kafka consumer groups process partitions in parallel threads"
    ],
    mistakes:[
      "Using synchronized on the wrong object — synchronizing on 'this' when you should lock a field",
      "ThreadLocal memory leaks in thread pool environments — always remove() in finally",
      "Assuming volatile fixes race conditions — it only guarantees visibility, not atomicity"
    ],
    production:"Multithreading bugs are the hardest to reproduce and fix. They appear in production under load and disappear in dev. Prevention requires knowing the model.",
    ready:[
      "Explain the Java Memory Model's happens-before rules",
      "Write a thread-safe singleton using double-checked locking with volatile",
      "Identify the deadlock in a given code snippet and fix it",
      "Explain when to use ReentrantLock over synchronized"
    ]
  },

  /* ════════════════════════════
     PHASE 2: JAVA MASTERY
  ════════════════════════════ */
  {
    id:"java_syntax", label:"Java Core", phase:"java_core",
    title:"Java language fundamentals and core APIs",
    why:"Java has 30 years of accumulated features. Know which ones are relevant, which are deprecated, and which are traps. Ignorance of the Collections Framework or String API costs you hours in every project.",
    badges:[{t:"Java",c:"b-platform"}],
    prereqs:["OOP — classes, inheritance, interfaces","Programming basics"],
    stages:[
      {label:"Beginner",items:[
        "Primitive types vs wrapper types: int vs Integer, autoboxing — and the NullPointerException trap",
        "String: immutability, String pool, equals() vs ==, intern()",
        "StringBuilder vs StringBuffer: when to use each",
        "Arrays class: sort, binarySearch, copyOf — don't reinvent the wheel",
        "Math class: abs, min, max, pow, ceil, floor, random",
        "Scanner and BufferedReader for input — and why BufferedReader is faster",
        "Static keyword: static fields, static methods, static blocks, static inner classes"
      ]},
      {label:"Intermediate",items:[
        "Collections Framework: List, Set, Map, Queue — know the implementation trade-offs cold",
        "ArrayList vs LinkedList vs ArrayDeque — know the access/insert complexity for each",
        "HashMap: load factor, capacity, rehashing, why it's not thread-safe",
        "TreeMap vs LinkedHashMap: sorted order vs insertion order",
        "Iterator and ListIterator: ConcurrentModificationException and why it happens",
        "Comparable vs Comparator: sorting objects — which to use when",
        "Optional: null safety — use it, but don't chain 10 deep"
      ]},
      {label:"Advanced",items:[
        "Generics: type erasure, wildcards (? extends T, ? super T), generic methods",
        "Enums: not just constants — enums with fields, methods, abstract methods",
        "Nested classes: static nested, inner, local, anonymous — when each makes sense",
        "Annotations: meta-programming, @Retention, @Target, reflection-based processing",
        "Reflection API: inspect and invoke at runtime — how Spring works under the hood",
        "Records (Java 16+): immutable data carriers, reduces boilerplate",
        "Sealed classes (Java 17+): exhaustive pattern matching, restricted hierarchies"
      ]}
    ],
    projects:[
      "Build a generic, typed cache using HashMap with expiry — no external libraries",
      "Implement your own ArrayList from scratch: dynamic array, iterator, generics",
      "Write a CSV parser that maps rows to generic POJOs using reflection and annotations",
      "Benchmark: String concatenation in loop vs StringBuilder — measure with JMH"
    ],
    usecases:[
      "Spring dependency injection uses reflection to instantiate and wire beans",
      "Hibernate uses reflection + annotations to map Java classes to database tables",
      "Jackson JSON serialization traverses object fields using reflection"
    ],
    mistakes:[
      "Using == to compare Strings — always equals()",
      "ArrayList default capacity causing excessive resizes — initialize with size if known",
      "Raw types: List instead of List<String> — loses type safety, compiles with warnings",
      "Ignoring NullPointerException from unboxing: Integer i = null; int x = i; // NPE"
    ],
    production:"Knowing the Collections Framework cold separates engineers who write O(n) lookups from those who write O(1). This shows up in every code review.",
    ready:[
      "State the time complexity of get, put, remove for HashMap, TreeMap, LinkedHashMap",
      "Explain type erasure and why List<String> and List<Integer> are the same at runtime",
      "Write a custom Comparator that sorts by multiple fields with null safety",
      "Explain what happens internally when you put a 10001st element into a HashMap with default capacity"
    ]
  },

  {
    id:"jvm", label:"JVM Internals", phase:"java_core",
    title:"JVM internals, garbage collection, and performance",
    why:"You will debug OutOfMemoryError, GC pauses, and memory leaks in production. Without understanding the JVM, you are guessing. Knowing GC algorithms lets you tune the JVM for your workload instead of cargo-culting JVM flags.",
    badges:[{t:"Java",c:"b-platform"}],
    prereqs:["Java Core — classes, objects, references","Memory & concurrency basics"],
    stages:[
      {label:"Beginner",items:[
        "JVM architecture: ClassLoader, Runtime Data Area, Execution Engine",
        "Heap structure: Young generation (Eden, Survivor S0/S1), Old generation, Metaspace",
        "Stack frames: local variable table, operand stack, frame data",
        "Bytecode: .class files, javap to disassemble, JIT compilation",
        "Garbage collection basics: reachability, GC roots (stack, static, JNI)",
        "Minor GC vs Major GC vs Full GC — and why Full GC is the emergency"
      ]},
      {label:"Intermediate",items:[
        "GC algorithms: Serial, Parallel, CMS (deprecated), G1, ZGC, Shenandoah",
        "G1GC: regions, mixed GC, evacuation failures, remembered sets",
        "ZGC and Shenandoah: concurrent, low-latency, sub-millisecond pauses",
        "Memory leaks: static collections, unclosed resources, ThreadLocal, listeners",
        "Heap dumps: jmap, VisualVM, Eclipse MAT — how to find the leak",
        "GC logs: -Xlog:gc*, interpreting pause times and allocation rates",
        "JVM flags: -Xmx, -Xms, -XX:NewRatio, -XX:G1HeapRegionSize"
      ]},
      {label:"Advanced",items:[
        "JIT compilation tiers: C1 (client), C2 (server), GraalVM JIT",
        "Escape analysis: object allocation on stack, lock elision — JVM optimization",
        "String interning and the String pool in Metaspace",
        "Class loading: delegation model, parent-first, hot deploy implications",
        "Native Memory Tracking (NMT): non-heap memory usage — DirectByteBuffer, JNI",
        "GraalVM native image: AOT compilation, startup time reduction, no JVM overhead",
        "JFR (Java Flight Recorder): production profiling with <1% overhead"
      ]}
    ],
    projects:[
      "Deliberately create 3 different types of memory leaks, reproduce them, then fix them",
      "Compare G1GC vs ZGC pause times under load with a benchmark — use JMH and JFR",
      "Analyze a heap dump using Eclipse MAT: find the leak dominator, report the cause",
      "Profile a slow application with JFR: find the hot method, optimize it, measure improvement"
    ],
    usecases:[
      "Production OutOfMemoryError at 3am — you must read the heap dump, not guess",
      "Latency spikes correlated with GC pauses — diagnose and switch GC algorithm",
      "Spring Boot app consuming 4GB for a trivial service — find the memory hog"
    ],
    mistakes:[
      "Setting -Xms != -Xmx in production — heap resizing causes GC pauses at startup",
      "Ignoring GC logs — they are the most actionable performance data available",
      "Treating memory leaks as mysterious — they always have a root cause in code"
    ],
    production:"Every Java application in production is a JVM tuning problem waiting to happen. Know it before prod teaches it to you at 3am.",
    ready:[
      "Explain what happens from new Object() to that object being collected by G1GC",
      "Read a GC log snippet and identify if there is a memory leak",
      "Name three causes of OutOfMemoryError: Java heap space and how you would diagnose each",
      "Choose between G1GC and ZGC for a latency-sensitive API — and justify your choice"
    ]
  },

  {
    id:"modern_java", label:"Modern Java", phase:"java_core",
    title:"Java 8+ features: streams, lambdas, and modern APIs",
    why:"Java 8 changed how production Java is written. Streams, lambdas, Optional, and CompletableFuture are in every modern codebase. Not knowing them means not being able to read or contribute to current Java code.",
    badges:[{t:"Java",c:"b-platform"}],
    prereqs:["Java Core — Collections, generics","OOP — functional interfaces are still interfaces"],
    stages:[
      {label:"Beginner",items:[
        "Functional interfaces: @FunctionalInterface, Predicate, Function, Consumer, Supplier",
        "Lambda syntax: (params) -> expression vs (params) -> { block }",
        "Method references: Class::method, instance::method, Class::new",
        "Stream basics: stream(), filter(), map(), collect(), forEach()",
        "Optional: of(), ofNullable(), orElse(), orElseThrow(), map(), flatMap()",
        "Default and static methods in interfaces — what they enable"
      ]},
      {label:"Intermediate",items:[
        "Stream terminal vs intermediate operations — lazy evaluation",
        "Collectors: toList(), toMap(), groupingBy(), partitioningBy(), joining()",
        "flatMap: flatten nested collections — essential for joins and nested data",
        "Parallel streams: when they help and when they hurt — thread safety requirements",
        "CompletableFuture: thenApply, thenCompose, allOf, anyOf, exceptionally, handle",
        "Date/Time API: LocalDate, LocalDateTime, ZonedDateTime, Duration, Period — replace Date/Calendar forever",
        "var keyword (Java 10+): local variable type inference — use judiciously"
      ]},
      {label:"Advanced",items:[
        "Records (Java 16+): immutable data carriers with auto-generated equals, hashCode, toString",
        "Sealed classes (Java 17+): restrict hierarchy, enable exhaustive pattern matching",
        "Pattern matching for instanceof (Java 16+): no more explicit cast after check",
        "Switch expressions (Java 14+): arrow case, yield, exhaustiveness checking",
        "Text blocks (Java 15+): multiline strings for JSON, SQL, HTML in tests",
        "Virtual threads (Java 21): Project Loom — massive concurrency without thread pool limits",
        "Structured concurrency (Java 21): treat multiple concurrent tasks as a unit"
      ]}
    ],
    projects:[
      "Rewrite a legacy imperative data processing pipeline using Streams — measure readability gain",
      "Build an async data aggregation service: call 5 external APIs in parallel with CompletableFuture, timeout at 2s, fallback on failure",
      "Implement a data transformation pipeline: CSV → Stream → filter → group → aggregate → JSON output",
      "Refactor a pre-Java 8 codebase: use Records, sealed classes, pattern matching, text blocks — justify each change"
    ],
    usecases:[
      "Spring Data repositories return Stream<T> for large datasets — infinite lazy processing",
      "CompletableFuture chains are how modern Spring services compose async calls",
      "Virtual threads (Java 21) will replace reactive programming for most use cases — understand the model"
    ],
    mistakes:[
      "Using parallel streams on non-thread-safe operations — silent data corruption",
      "Chaining 15 stream operations into one unreadable line — streams can be broken across lines",
      "Optional.get() without isPresent() — defeats the purpose of Optional entirely",
      "Using Date/Calendar instead of java.time — Date is broken by design"
    ],
    production:"Modern Java is cleaner, safer, and faster than legacy Java. Employers expect Java 8+ fluency as a minimum. Java 21 virtual threads are changing backend architecture.",
    ready:[
      "Write a complex stream pipeline: filter, group by, transform, collect to Map<String, List<T>>",
      "Chain a CompletableFuture pipeline with parallel execution and error recovery",
      "Explain why parallel streams can cause incorrect results on a shared mutable list",
      "Implement the same logic using Records and sealed classes — explain the safety guarantees"
    ]
  },

  {
    id:"java_concurrency", label:"Java Concurrency", phase:"java_core",
    title:"Java concurrency: production-grade multithreading",
    why:"Every Spring web application is multithreaded. Every database connection pool is thread-safe. Every Kafka consumer runs concurrent threads. Writing correct concurrent code is not optional at the senior level.",
    badges:[{t:"Java",c:"b-platform"}],
    prereqs:["Memory & concurrency basics — fundamentals section","Modern Java — CompletableFuture"],
    stages:[
      {label:"Beginner",items:[
        "Thread vs Runnable vs Callable: differences and when to use each",
        "Executor and ExecutorService: fixed, cached, scheduled thread pools",
        "Future: submit(), get(), cancel() — blocking result retrieval",
        "synchronized blocks vs methods: scope matters for performance",
        "volatile guarantees: visibility without atomicity"
      ]},
      {label:"Intermediate",items:[
        "ReentrantLock: tryLock(), lockInterruptibly(), fairness — when to prefer over synchronized",
        "ReadWriteLock: concurrent reads, exclusive writes — use in read-heavy caches",
        "Concurrent collections: ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue",
        "CountDownLatch, CyclicBarrier, Semaphore, Phaser — coordination primitives",
        "Atomic classes: AtomicInteger, AtomicReference, AtomicStampedReference (ABA problem)",
        "CompletableFuture async pipeline: thenApplyAsync, thenComposeAsync, custom executor"
      ]},
      {label:"Advanced",items:[
        "StampedLock: optimistic reads, upgrade from read to write lock",
        "Virtual threads (Java 21): millions of lightweight threads, structured concurrency API",
        "Memory model guarantees: happens-before, piggybacking on synchronization",
        "Lock-free algorithms: CAS loops, ABA problem and solution with AtomicStampedReference",
        "Thread-safe singleton patterns: enum singleton, holder pattern, double-checked locking",
        "Detecting concurrency bugs: thread sanitizers, jcstress for correctness testing"
      ]}
    ],
    projects:[
      "Build a thread-safe in-memory cache with TTL expiry using ReadWriteLock",
      "Implement a bounded blocking queue from scratch — producer/consumer with backpressure",
      "Rate limiter using Semaphore: limit to N requests per second across concurrent threads",
      "Compare throughput of platform threads vs virtual threads (Java 21) for blocking I/O workload"
    ],
    usecases:[
      "HikariCP uses ConcurrentHashMap and locks to manage connection pool state",
      "Spring @Async runs methods in a thread pool — misconfiguring it causes thread starvation",
      "Kafka consumers use thread-safe queues internally to hand off records to processing threads"
    ],
    mistakes:[
      "Using Collections.synchronizedList() when CopyOnWriteArrayList or ConcurrentHashMap fits better",
      "Calling Future.get() on the main thread — blocks and defeats async purpose",
      "Creating new Thread() in a loop — thread creation is expensive, use pools",
      "Not shutting down ExecutorService — threads stay alive, process never exits"
    ],
    production:"Concurrency bugs don't appear in dev. They appear in production under load, are non-deterministic, and can corrupt data silently. Prevention is the only viable strategy.",
    ready:[
      "Implement a thread-safe LRU cache with O(1) get and put using LinkedHashMap + ReadWriteLock",
      "Explain the ABA problem in lock-free programming and how AtomicStampedReference solves it",
      "Design a rate limiter for 1000 requests/second shared across a thread pool",
      "Explain the difference between ConcurrentHashMap and synchronizedMap"
    ]
  },

  /* ════════════════════════════
     PHASE 3: BACKEND & APIS
  ════════════════════════════ */
  {
    id:"spring_boot", label:"Spring Boot", phase:"backend",
    title:"Spring Boot and the Spring ecosystem",
    why:"Spring Boot is the de-facto standard for Java backend development. 80% of Java backend job descriptions require it. If you know Spring Boot deeply, you know how most Java production systems are built.",
    badges:[{t:"Backend",c:"b-devops"}],
    prereqs:["Java Core — OOP, generics, annotations","Modern Java — lambdas, streams","JVM internals — how beans are created under the hood"],
    stages:[
      {label:"Beginner",items:[
        "Spring IoC container: ApplicationContext, BeanFactory — what dependency injection actually is",
        "@Component, @Service, @Repository, @Controller: stereotype annotations",
        "@Autowired, @Qualifier, @Primary: wiring beans",
        "@Configuration and @Bean: Java-based configuration",
        "application.properties vs application.yml: externalized configuration",
        "@SpringBootApplication: @Configuration + @EnableAutoConfiguration + @ComponentScan",
        "Spring Boot starters: spring-boot-starter-web, -data-jpa, -security"
      ]},
      {label:"Intermediate",items:[
        "@RestController, @GetMapping, @PostMapping, @RequestBody, @PathVariable, @RequestParam",
        "Spring Profiles: @Profile, spring.profiles.active — environment-specific config",
        "@ConfigurationProperties: type-safe config binding",
        "Spring Data JPA: JpaRepository, query methods, @Query with JPQL/native",
        "Spring Validation: @Valid, @NotNull, @Size, @Pattern, MethodArgumentNotValidException",
        "Exception handling: @ControllerAdvice, @ExceptionHandler, ProblemDetail (RFC 7807)",
        "Actuator: /health, /metrics, /info, custom health indicators"
      ]},
      {label:"Advanced",items:[
        "Spring Security: SecurityFilterChain, JWT authentication, OAuth2 resource server",
        "Spring AOP: @Aspect, @Around, @Before — cross-cutting concerns without coupling",
        "Bean scopes: singleton vs prototype vs request vs session — and thread safety implications",
        "Event-driven Spring: ApplicationEvent, @EventListener, @TransactionalEventListener",
        "Spring Retry and Circuit Breaker with Resilience4j",
        "Spring Cache: @Cacheable, @CacheEvict, @CachePut with Redis backend",
        "Spring Boot testing: @SpringBootTest, @WebMvcTest, @DataJpaTest, TestContainers"
      ]}
    ],
    projects:[
      "Build a complete REST API: CRUD, validation, exception handling, pagination, Swagger docs",
      "Add Spring Security with JWT: register, login, token refresh, role-based access",
      "Implement caching with Redis: @Cacheable on expensive queries, eviction strategy",
      "Build a resilient service: circuit breaker, retry with exponential backoff, timeout, fallback"
    ],
    usecases:[
      "Every enterprise Java API is Spring Boot — this is not an exaggeration",
      "@Transactional(REQUIRES_NEW) for audit logging independent of business transaction outcome",
      "Spring AOP for distributed tracing: inject trace IDs into every log line without polluting business code"
    ],
    mistakes:[
      "Field injection (@Autowired on field) instead of constructor injection — untestable and hides dependencies",
      "@Transactional on private methods — proxy-based AOP cannot intercept them",
      "Putting business logic in @RestController — controllers are routing only",
      "Not understanding bean scope — singleton service holding request-scoped state = thread safety bug"
    ],
    production:"Spring Boot is the production standard. Every Fortune 500 Java backend runs it. Knowing it deeply means understanding the platform all your code runs on.",
    ready:[
      "Explain how Spring's dependency injection works without using the word 'magic'",
      "Build a production-grade REST endpoint with validation, error handling, and logging in under 30 minutes",
      "Explain why @Transactional on a private method doesn't work",
      "Design a caching strategy for a user profile endpoint with 10k req/s"
    ]
  },

  {
    id:"rest_microservices", label:"REST & Microservices", phase:"backend",
    title:"RESTful API design and microservices architecture",
    why:"REST is the communication protocol of the internet. Microservices are how production systems are structured at scale. You will design and consume APIs every day. Doing it wrong creates maintenance nightmares.",
    badges:[{t:"Backend",c:"b-devops"}],
    prereqs:["Spring Boot","Networking — HTTP, status codes, headers","Docker — each microservice is a container"],
    stages:[
      {label:"Beginner",items:[
        "REST principles: stateless, uniform interface, resource-based URLs",
        "HTTP methods: GET (idempotent), POST, PUT (idempotent), PATCH, DELETE",
        "Status codes: 200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500, 503",
        "Request/response structure: headers, body, content negotiation",
        "API versioning: URI versioning (/v1/), header versioning — trade-offs",
        "OpenAPI/Swagger: document-first vs code-first API design"
      ]},
      {label:"Intermediate",items:[
        "Monolith vs microservices: the honest trade-off — don't start with microservices",
        "Service decomposition: bounded contexts from DDD, not arbitrary splitting",
        "Synchronous (REST/gRPC) vs asynchronous (Kafka/RabbitMQ) inter-service communication",
        "API Gateway: single entry point, auth, rate limiting, routing — Spring Cloud Gateway, Kong",
        "Service discovery: Eureka, Consul — how services find each other",
        "Circuit breaker pattern: fail fast to prevent cascading failure — Resilience4j",
        "Pagination: cursor-based vs offset — why cursor scales and offset does not"
      ]},
      {label:"Advanced",items:[
        "Saga pattern: distributed transactions across microservices — choreography vs orchestration",
        "CQRS: separate read and write models — when reads and writes have different scaling needs",
        "Event sourcing: state as a sequence of events, replay to reconstruct",
        "Idempotency keys: safe retry for payments and critical mutations",
        "gRPC: Protocol Buffers, HTTP/2, streaming — when to prefer over REST",
        "GraphQL: flexible querying, N+1 problem and DataLoader solution",
        "Rate limiting and throttling: token bucket, leaky bucket algorithms"
      ]}
    ],
    projects:[
      "Design a microservices architecture for an e-commerce platform: order, inventory, payment, notification services",
      "Implement the saga pattern for a payment flow: reserve inventory → charge card → confirm order → rollback on failure",
      "Build an API Gateway with Spring Cloud Gateway: auth filter, rate limiting, circuit breaker",
      "Convert a monolith to microservices incrementally using the strangler fig pattern — document every decision"
    ],
    usecases:[
      "Payment services use idempotency keys to prevent double-charging on network retry",
      "Saga pattern with Kafka choreography: each service emits events, other services react",
      "CQRS in an e-commerce reporting service: writes go to MySQL, reads from Elasticsearch"
    ],
    mistakes:[
      "Microservices from day one — distributed complexity kills small teams",
      "Chatty microservices: 10 synchronous calls to serve one user request — kill it with async or BFF",
      "No idempotency — retried requests process payments twice",
      "Versioning APIs as /v1/, /v2/ and abandoning v1 instantly — break clients in production"
    ],
    production:"Most production systems are either monoliths or microservices. Knowing both and when to choose which is what distinguishes a senior from a mid-level engineer.",
    ready:[
      "Design a REST API for a blog platform: resources, endpoints, status codes, pagination",
      "Explain the saga pattern and implement choreography-based saga for a 3-step transaction",
      "Argue for or against microservices for a 5-person engineering team starting a new product"
    ]
  },

  {
    id:"auth", label:"Auth & Security", phase:"backend",
    title:"Authentication, authorization, and security",
    why:"Security is not optional. OWASP Top 10 vulnerabilities are in production systems everywhere. JWT misconfiguration, SQL injection, and broken auth cause real breaches. Every senior engineer is responsible for this.",
    badges:[{t:"Backend",c:"b-devops"}],
    prereqs:["Spring Boot — Spring Security","REST APIs — HTTP, headers","Networking — HTTPS, TLS"],
    stages:[
      {label:"Beginner",items:[
        "Authentication vs authorization: who are you vs what can you do",
        "Session-based auth: stateful, server stores session, cookie-based",
        "JWT: header.payload.signature — stateless auth, do not store sensitive data in payload",
        "BCrypt password hashing: why MD5 and SHA1 are wrong — cost factor and salting",
        "HTTPS/TLS: why plaintext HTTP is never acceptable for auth",
        "CORS: why browsers block cross-origin requests, how to configure correctly"
      ]},
      {label:"Intermediate",items:[
        "OAuth 2.0 flows: Authorization Code (web apps), Client Credentials (M2M), Device Flow",
        "OpenID Connect (OIDC): OAuth 2.0 + identity layer, ID token vs access token",
        "JWT validation: verify signature, check expiry, check issuer — never trust unverified JWT",
        "Role-based access control (RBAC): roles, permissions, Spring Security method-level @PreAuthorize",
        "Refresh token rotation: why access tokens should be short-lived (15 min) and refresh long-lived",
        "Spring Security SecurityFilterChain: filter ordering, request matchers",
        "Rate limiting: protect auth endpoints from brute force"
      ]},
      {label:"Advanced",items:[
        "OWASP Top 10: Injection, Broken Auth, XSS, IDOR, SSRF, Security Misconfig — with Java examples",
        "SQL Injection prevention: PreparedStatement, parameterized queries — never string concatenation",
        "Attribute-based access control (ABAC): policy-based, more granular than RBAC",
        "Zero trust architecture: authenticate every service-to-service call, not just edge",
        "mTLS: mutual TLS for service-to-service auth without application-level tokens",
        "Secrets management: no credentials in code, Vault or AWS Secrets Manager",
        "Security testing: OWASP ZAP, dependency scanning with OWASP Dependency-Check"
      ]}
    ],
    projects:[
      "Build complete JWT auth: register, login, access token (15min), refresh token (7 day), rotation",
      "Implement OAuth2 login with Google in Spring Boot — Authorization Code flow",
      "Find and fix 5 OWASP vulnerabilities in a deliberately insecure Spring Boot app (WebGoat)",
      "Implement RBAC with Spring Security: admin can CRUD, user can read only, unauthorized gets 403"
    ],
    usecases:[
      "Every SaaS API uses OAuth2 Client Credentials for service-to-service auth",
      "Financial services use RBAC with fine-grained permissions down to account level",
      "SQL injection in 2024 still causes breaches — PreparedStatement prevents all of them"
    ],
    mistakes:[
      "Storing passwords as MD5 or SHA1 hash — crackable in minutes on modern hardware",
      "Long-lived JWT with no refresh rotation — stolen token valid forever",
      "Trusting user-supplied JWT without verifying signature",
      "Logging sensitive data (passwords, tokens) to application logs"
    ],
    production:"Security is a production requirement, not a feature. One SQL injection finding in a pen test can delay a product launch by months.",
    ready:[
      "Implement JWT auth with refresh token rotation from scratch in Spring Boot",
      "Explain all 4 OAuth2 flows and which to use for a mobile app vs server-to-server",
      "Find the SQL injection vulnerability in a code snippet and fix it",
      "Explain why base64-encoded JWT is not encrypted"
    ]
  },

  /* ════════════════════════════
     PHASE 4: DATABASES
  ════════════════════════════ */
  {
    id:"sql", label:"SQL & RDBMS", phase:"databases",
    title:"SQL, relational databases, and query optimization",
    why:"Every application persists data. SQL skills are the difference between a slow query that costs $10,000/month in DB compute and an optimized query that costs $200. You will write SQL every day.",
    badges:[{t:"Database",c:"b-observability"}],
    prereqs:["Programming basics — logic, data types","OOP — entities map to tables"],
    stages:[
      {label:"Beginner",items:[
        "SELECT, WHERE, ORDER BY, LIMIT, OFFSET",
        "INSERT, UPDATE, DELETE — and why DELETE without WHERE is a career event",
        "JOINs: INNER, LEFT, RIGHT, FULL OUTER — when each is appropriate",
        "Aggregate functions: COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING",
        "Normalization: 1NF, 2NF, 3NF — eliminate redundancy, prevent update anomalies",
        "Primary keys, foreign keys, unique constraints, NOT NULL",
        "Transactions: COMMIT, ROLLBACK, SAVEPOINT"
      ]},
      {label:"Intermediate",items:[
        "Indexes: B-tree structure, composite indexes, covering indexes — what gets used and when",
        "EXPLAIN / EXPLAIN ANALYZE: read the query plan, identify full table scans",
        "N+1 query problem: how lazy loading creates 1 + N queries and how to fix it",
        "Window functions: ROW_NUMBER, RANK, LAG, LEAD, PARTITION BY — replace subqueries",
        "CTEs: WITH clause for readable recursive queries",
        "Transaction isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE",
        "Optimistic vs pessimistic locking: SELECT FOR UPDATE vs version column"
      ]},
      {label:"Advanced",items:[
        "Query optimization: selectivity, cardinality, statistics, index usage hints",
        "Partitioning: range, list, hash — horizontal scaling within one database",
        "Replication: master-replica, read replica routing — how connection pools route reads",
        "Connection pooling: HikariCP config — maxPoolSize, connectionTimeout, idleTimeout",
        "Database sharding: horizontal partitioning across multiple databases — and why it's the last resort",
        "Vacuum and table bloat in PostgreSQL — why DELETEs don't free space immediately",
        "JSON columns in PostgreSQL: structured schema + semi-structured data — when to use"
      ]}
    ],
    projects:[
      "Design a schema for an e-commerce platform: normalize to 3NF, identify all indexes needed",
      "Optimize a slow query: start from EXPLAIN output, add indexes, measure improvement",
      "Demonstrate transaction isolation: show dirty read, non-repeatable read, phantom read",
      "Implement optimistic locking with @Version in JPA: simulate concurrent update conflict"
    ],
    usecases:[
      "N+1 problem in Hibernate with lazy loading: detected in prod as 10x latency spike",
      "Missing index on a foreign key causes full table scan on every JOIN — common in legacy apps",
      "Transaction isolation level mismatch causes inventory overselling in e-commerce"
    ],
    mistakes:[
      "SELECT * in production code — over-fetches columns, breaks if schema changes",
      "No indexes on foreign keys — every JOIN becomes a full table scan",
      "Using OFFSET pagination at page 10,000 — scans 10,000 rows to skip them",
      "Not understanding transaction scope — @Transactional on a method that calls another @Transactional"
    ],
    production:"Database performance is application performance. The query you write in 5 minutes runs 10 million times per day in production.",
    ready:[
      "Write a window function query that ranks users by spending within each country",
      "Read an EXPLAIN output and identify why a query is slow",
      "Explain the difference between REPEATABLE READ and SERIALIZABLE isolation",
      "Design an indexing strategy for a table with 100M rows queried by 5 different column combinations"
    ]
  },

  {
    id:"nosql", label:"NoSQL & Redis", phase:"databases",
    title:"NoSQL databases, Redis, and data modeling",
    why:"Not all data is relational. Redis powers every session store, cache, and rate limiter. MongoDB handles flexible schema documents. Knowing when to use each — and when not to — is what separates architects from developers.",
    badges:[{t:"Database",c:"b-observability"}],
    prereqs:["SQL fundamentals — understand relational before non-relational","Spring Boot — Redis and MongoDB Spring integrations"],
    stages:[
      {label:"Beginner",items:[
        "CAP theorem: Consistency, Availability, Partition tolerance — choose 2",
        "Document stores (MongoDB): collection, document, BSON, embedded vs referenced documents",
        "Key-value stores (Redis): strings, hashes, lists, sets, sorted sets — each has a use case",
        "Redis data types: String (cache), Hash (object), List (queue), Set (unique members), Sorted Set (leaderboard)",
        "When NoSQL: flexible schema, high write throughput, document-centric access patterns",
        "When SQL: complex queries, ACID transactions, relational data with JOINs"
      ]},
      {label:"Intermediate",items:[
        "MongoDB queries: find(), aggregate pipeline, $match, $group, $lookup (JOIN equivalent)",
        "MongoDB indexing: single field, compound, text, geospatial",
        "Redis caching patterns: cache-aside, write-through, write-behind — trade-offs",
        "Redis pub/sub: lightweight messaging, no durability — distinguish from Kafka",
        "Redis persistence: RDB snapshots vs AOF log — durability vs performance",
        "TTL on Redis keys: automatic expiry — use for sessions, rate limiting counters, idempotency keys",
        "Spring Data MongoDB and Spring Data Redis: repository abstraction"
      ]},
      {label:"Advanced",items:[
        "Redis Cluster: sharding across nodes, hash slots, replica configuration",
        "Redis Sentinel: HA without cluster — automatic failover for smaller deployments",
        "MongoDB replica sets: primary/secondary, read preference, write concern",
        "MongoDB sharding: hashed vs ranged shard key — choosing the wrong key destroys performance",
        "Distributed locking with Redis: Redlock algorithm — and its controversies",
        "Redis Streams: durable, ordered event log — competes with Kafka for simpler use cases",
        "Consistency patterns: eventual consistency, read-your-own-writes, monotonic reads"
      ]}
    ],
    projects:[
      "Build a rate limiter with Redis: token bucket per user, 100 req/min, atomic with MULTI/EXEC",
      "Implement a session store with Redis: JWT-less stateful sessions with TTL",
      "Build a leaderboard with Redis sorted sets: add score, get top-10, get rank by user",
      "Design a product catalog in MongoDB: embedded reviews vs referenced, benchmark read performance"
    ],
    usecases:[
      "Redis as L2 cache in front of PostgreSQL: 5ms read from Redis vs 50ms from DB",
      "MongoDB for a CMS: flexible content schema, each article type has different fields",
      "Redis for distributed rate limiting across 20 API server instances"
    ],
    mistakes:[
      "Using MongoDB when you have relational data and need transactions — use PostgreSQL",
      "Redis without persistence in a use case that requires durability — data lost on restart",
      "Hotkey problem in Redis Cluster: one key gets all traffic, one node is overwhelmed",
      "MongoDB without indexes on query fields — collection scan on every query"
    ],
    production:"Redis is in every production backend stack. It is not optional infrastructure — it is the caching and session layer of the internet.",
    ready:[
      "Explain CAP theorem with a specific example for each of CP, AP, CA systems",
      "Implement a distributed rate limiter in Redis that is atomic and correct",
      "Choose between MongoDB, PostgreSQL, and Redis for 3 different data access patterns — justify each",
      "Explain Redis persistence options and which to use for a session store vs a cache"
    ]
  },

  {
    id:"orm", label:"Hibernate & JPA", phase:"databases",
    title:"Hibernate, JPA, and ORM patterns",
    why:"Hibernate is under every Spring Data JPA repository. Not understanding it means mysterious N+1 queries, LazyInitializationException, and transactions that silently fail. You must know what JPA is doing on your behalf.",
    badges:[{t:"Database",c:"b-observability"}],
    prereqs:["SQL — ORM generates SQL, you must verify it's the right SQL","Spring Boot — Spring Data JPA wraps Hibernate"],
    stages:[
      {label:"Beginner",items:[
        "@Entity, @Table, @Id, @GeneratedValue: mapping a class to a table",
        "Entity lifecycle: transient, persistent, detached, removed",
        "@Column: name, nullable, unique, length — explicit is better than default",
        "@OneToMany, @ManyToOne, @OneToOne, @ManyToMany: relationship mapping",
        "FetchType.LAZY vs EAGER: default behavior and why EAGER is almost always wrong",
        "Spring Data JPA: JpaRepository, CrudRepository, query method naming conventions"
      ]},
      {label:"Intermediate",items:[
        "N+1 problem: lazy collection triggers N queries — solve with JOIN FETCH or @EntityGraph",
        "@Transactional: propagation types (REQUIRED, REQUIRES_NEW, NESTED), isolation levels",
        "First-level cache (persistence context): why two finds in one transaction return same object",
        "Second-level cache (Ehcache/Redis): shared cache across transactions",
        "JPQL vs native queries: when to use @Query, named queries",
        "Projections: interface projections and DTO projections — avoid fetching full entities for reads",
        "Optimistic locking: @Version annotation, ObjectOptimisticLockingFailureException"
      ]},
      {label:"Advanced",items:[
        "Batch inserts/updates: spring.jpa.properties.hibernate.jdbc.batch_size — 100x performance",
        "Entity inheritance strategies: SINGLE_TABLE, TABLE_PER_CLASS, JOINED — trade-offs",
        "Soft deletes: @SQLDelete, @Where — filter deleted without removing rows",
        "Hibernate Envers: entity versioning and audit log",
        "Multi-tenancy: schema-per-tenant, database-per-tenant strategies",
        "Custom UserType: mapping non-standard columns (PostgreSQL enum, JSON, UUID)",
        "Persistence context pitfalls: open session in view anti-pattern, detached entity issues"
      ]}
    ],
    projects:[
      "Build an entity graph that eliminates all N+1 queries in a blog API with posts, authors, comments",
      "Implement soft deletes on a User entity: delete sets deleted_at, all queries filter it out",
      "Demonstrate optimistic locking conflict: two threads update same row, handle the exception",
      "Enable batch inserts and measure throughput: insert 10,000 records with and without batching"
    ],
    usecases:[
      "Every Spring Data JPA query generates SQL — enable show-sql=true in dev and always review it",
      "Multi-tenant SaaS: schema-per-tenant with Hibernate tenant resolver",
      "Audit log with Hibernate Envers: every change to an Order entity is versioned and queryable"
    ],
    mistakes:[
      "FetchType.EAGER on collections — loads everything always, guaranteed performance problem",
      "Not enabling batch inserts for bulk operations — 100x slower than necessary",
      "Open Session in View: keeping persistence context open during view rendering — lazy loads in wrong layer",
      "Bidirectional relationships without @JsonManagedReference/@JsonBackReference — infinite JSON recursion"
    ],
    production:"JPA is the abstraction that hides SQL. The engineers who know what SQL it generates write fast applications. Those who don't create slow ones.",
    ready:[
      "Identify and fix an N+1 problem in a given JPA entity graph",
      "Explain what happens at the database level when @Transactional(propagation = REQUIRES_NEW) is used",
      "Implement optimistic locking and explain when to use it vs pessimistic locking",
      "Enable and configure second-level cache for a read-heavy entity"
    ]
  },

  /* ════════════════════════════
     PHASE 5: SYSTEM DESIGN
  ════════════════════════════ */
  {
    id:"system_design_core", label:"System Design", phase:"system_design",
    title:"High-level and low-level system design",
    why:"System design is the senior engineer interview. It is also what you do every day at work. A codebase is only as good as the architecture it was designed on. This is the highest-leverage skill for career progression.",
    badges:[{t:"Architecture",c:"b-sre"}],
    prereqs:["Backend APIs — REST, microservices","Databases — SQL, NoSQL, caching","Networking — load balancers, DNS, CDN"],
    stages:[
      {label:"Beginner",items:[
        "Vertical vs horizontal scaling: scale up vs scale out — limits and costs",
        "Load balancers: round-robin, least connections, IP hash — when each applies",
        "CDN: static asset distribution, edge caching, cache invalidation",
        "Database read replicas: route reads away from primary, replication lag",
        "Stateless services: horizontal scaling requires statelessness — sessions in Redis not in-memory",
        "Back-of-the-envelope estimation: users × requests/day → QPS, storage requirements"
      ]},
      {label:"Intermediate",items:[
        "Caching: L1 (in-process), L2 (Redis), L3 (CDN) — and cache invalidation strategies",
        "Message queues: async processing, decoupling producer from consumer, backpressure",
        "Database sharding: consistent hashing, shard key selection, rebalancing",
        "CAP theorem in practice: choosing consistency vs availability for your use case",
        "Design patterns: Factory, Singleton, Strategy, Observer, Builder, Decorator, Proxy",
        "API design for scale: idempotency, pagination, versioning, backward compatibility",
        "Rate limiting algorithms: token bucket, leaky bucket, sliding window counter"
      ]},
      {label:"Advanced",items:[
        "Event-driven architecture: event sourcing, CQRS, eventual consistency",
        "Distributed transactions: 2PC, saga pattern, outbox pattern",
        "Consistency models: strong, eventual, causal, read-your-own-writes",
        "Service mesh: Istio/Linkerd, sidecar proxy, mTLS, traffic management, observability",
        "Multi-region deployment: active-active, active-passive, data sovereignty",
        "Chaos engineering: intentional failure, validate assumptions about resilience",
        "Cost optimization: reserved instances, right-sizing, eliminating waste"
      ]}
    ],
    projects:[
      "Design URL shortener: API, storage, 301 vs 302, analytics, 100M URLs, high read QPS",
      "Design a rate limiter as a service: distributed, Redis-backed, 50ms latency SLA",
      "Design a notification system: email, SMS, push — fan-out, delivery guarantee, deduplication",
      "Design Twitter timeline: celebrity problem, push vs pull, hybrid approach, storage"
    ],
    usecases:[
      "Instagram moved from fat client to backend-rendered timeline to handle follow graph complexity",
      "Slack moved from long polling to WebSocket + event-driven architecture for real-time",
      "Amazon uses saga pattern for every order — distributed transaction across 10 services"
    ],
    mistakes:[
      "Over-engineering for scale that does not exist yet — the startup that dies from premature optimization",
      "Designing without constraints — always ask scale, QPS, latency SLA, data size before drawing boxes",
      "Single point of failure: no load balancer, no replica, no failover — one box going down = downtime"
    ],
    production:"System design skills determine your level. Junior engineers implement features. Senior engineers design systems. Staff engineers design architectures.",
    ready:[
      "Design a URL shortener in 45 minutes: requirements, API, data model, scalability",
      "Explain the outbox pattern and when to use it over a saga",
      "Calculate QPS and storage requirements for a given scale problem",
      "Choose between SQL, NoSQL, and a message queue for a given design component — and justify"
    ]
  },

  {
    id:"messaging", label:"Kafka & Messaging", phase:"system_design",
    title:"Kafka, RabbitMQ, and asynchronous messaging",
    why:"Messaging systems are how production microservices communicate asynchronously. Kafka is the backbone of data pipelines, event sourcing, and async workflows at every major tech company. RabbitMQ handles task queues in simpler architectures.",
    badges:[{t:"Architecture",c:"b-sre"}],
    prereqs:["Microservices — async inter-service communication","System design — decoupling and backpressure"],
    stages:[
      {label:"Beginner",items:[
        "Message queue vs pub/sub: point-to-point vs broadcast",
        "RabbitMQ: exchange types (direct, fanout, topic, headers), queue, binding, consumer",
        "Kafka basics: topic, partition, offset, consumer group, producer, broker",
        "At-least-once vs at-most-once vs exactly-once delivery semantics",
        "Dead letter queue (DLQ): what happens to messages that fail repeatedly",
        "Kafka retention: messages are stored on disk, consumers can replay — not like a queue"
      ]},
      {label:"Intermediate",items:[
        "Kafka partitioning: partition key determines ordering, consumer group = parallelism",
        "Consumer group rebalancing: what happens when a consumer joins or leaves",
        "Kafka producer config: acks=all, retries, idempotent producer — durability vs throughput",
        "Consumer offset management: auto-commit vs manual commit — at-least-once delivery",
        "Kafka Connect: source and sink connectors for data pipelines without custom code",
        "Schema Registry (Confluent): Avro/Protobuf schemas, schema evolution, backward/forward compatibility",
        "Spring Kafka: @KafkaListener, KafkaTemplate, error handling, retry"
      ]},
      {label:"Advanced",items:[
        "Kafka Streams: stateful stream processing, KTable, joins, aggregations",
        "Exactly-once semantics in Kafka: idempotent producer + transactional consumer",
        "Kafka compaction: keep only latest value per key — event sourcing state snapshots",
        "Transactional outbox pattern: write to DB and publish event atomically without 2PC",
        "Kafka vs RabbitMQ: retention, ordering, throughput, delivery guarantees — choosing correctly",
        "Consumer lag monitoring: measure and alert on how far behind consumers are",
        "Multi-datacenter Kafka: MirrorMaker 2, replication, failover strategies"
      ]}
    ],
    projects:[
      "Order processing system: order placed → inventory reserved → payment charged → notification sent — all via Kafka",
      "Implement transactional outbox: write order to DB and Kafka atomically, prove no duplicate events",
      "Build a Kafka consumer with DLQ: 3 retries, exponential backoff, move to DLQ, alert on DLQ depth",
      "Stream processing: consume order events, calculate real-time revenue by region using Kafka Streams"
    ],
    usecases:[
      "Kafka as the event log for CQRS: events written to Kafka, read models built by consumers",
      "RabbitMQ for background job processing: image resizing, email sending, PDF generation",
      "Kafka Connect to sync PostgreSQL changes to Elasticsearch via Debezium (CDC)"
    ],
    mistakes:[
      "Using message queue for request/response — use REST or gRPC; queues are for fire-and-forget",
      "No idempotency on consumer side — at-least-once delivery means duplicates will happen",
      "All messages in one partition — loses parallelism, consumers can't scale",
      "Auto-committing offsets before processing succeeds — losing messages on consumer crash"
    ],
    production:"Kafka is the event backbone of every large-scale production system. If you do not know Kafka, you cannot design or debug distributed data pipelines.",
    ready:[
      "Explain the difference between consumer group and consumer — and how parallelism works",
      "Implement exactly-once delivery in Kafka and explain the guarantees at each layer",
      "Design the transactional outbox pattern and explain why it solves dual-write",
      "Choose between Kafka and RabbitMQ for a notification system — justify with trade-offs"
    ]
  },

  /* ════════════════════════════
     PHASE 6: DEVOPS AWARENESS
  ════════════════════════════ */
  {
    id:"devops_developer", label:"DevOps for Developers", phase:"devops",
    title:"DevOps essentials for Java developers",
    why:"Developers who can't build, containerize, and deploy their own services are blocked on ops teams. CI/CD, Docker, and basic Kubernetes are now expected from mid-level Java engineers.",
    badges:[{t:"DevOps",c:"b-devops"}],
    prereqs:["Linux basics — files, processes, environment variables","Git — pipelines trigger on git events","Bash — pipeline steps are shell commands"],
    stages:[
      {label:"Beginner",items:[
        "Git workflow: feature branches, PRs, code review, merge — team collaboration",
        "Git internals: commits, trees, HEAD, staging area, rebase vs merge",
        "Dockerfile for Spring Boot: multi-stage build, non-root user, JVM tuning flags",
        "docker-compose: local dev stack — app + postgres + redis in one command",
        "CI/CD concept: every commit triggers automated build, test, deploy",
        "GitHub Actions: workflow YAML, triggers, jobs, steps, secrets"
      ]},
      {label:"Intermediate",items:[
        "Kubernetes for developers: Deployment, Service, ConfigMap, Secret, Ingress",
        "kubectl: get, describe, logs, exec, port-forward — your debugging toolkit",
        "Health checks: readinessProbe, livenessProbe — Spring Actuator /health endpoint",
        "Resource requests and limits: CPU and memory — set them or risk eviction",
        "AWS basics: EC2, S3, RDS, EKS, ECR, IAM roles — navigate without getting lost",
        "12-factor app: configuration in environment variables, stateless, one codebase"
      ]},
      {label:"Advanced",items:[
        "Helm charts: templated Kubernetes manifests, environment-specific values",
        "GitOps: Argo CD watching a git repo — infrastructure as code for deployments",
        "OIDC authentication: GitHub Actions to AWS without static credentials",
        "Observability from application side: structured logging (Logback JSON), metrics (Micrometer), tracing (OpenTelemetry)",
        "Distributed tracing: trace ID propagation across service boundaries, Jaeger, Zipkin",
        "Blue/green and canary deployments: zero-downtime, risk mitigation"
      ]}
    ],
    projects:[
      "Containerize a Spring Boot app: multi-stage Dockerfile, JVM tuning, non-root user, < 200MB image",
      "GitHub Actions pipeline: lint → test → build Docker image → push to ECR → deploy to EKS",
      "Add OpenTelemetry to a Spring Boot app: traces, metrics, logs all correlated by trace ID",
      "Deploy a multi-service app to Kubernetes: app + postgres + redis, all with health checks and resource limits"
    ],
    usecases:[
      "Spring Boot Actuator /health used as Kubernetes readinessProbe — prevents traffic before app is ready",
      "Micrometer + Prometheus: every Spring Boot app emits JVM, HTTP, and custom metrics automatically",
      "OpenTelemetry trace ID in logs: find all logs for one user request across 5 services in seconds"
    ],
    mistakes:[
      "Not setting JVM heap flags in Docker: JVM uses host memory limits instead of container limits — OOMKilled",
      "Embedding credentials in Docker image or Kubernetes manifests — use Secrets and IRSA",
      "No readinessProbe: Kubernetes sends traffic to pod before Spring Boot finishes startup"
    ],
    production:"Developers who own their deployment pipeline ship faster and debug production issues faster. DevOps is not someone else's job anymore.",
    ready:[
      "Write a Dockerfile for Spring Boot: multi-stage, set -XX:MaxRAMPercentage=75.0, non-root",
      "Write a GitHub Actions pipeline that builds, tests, and deploys to Kubernetes",
      "Use kubectl to debug a CrashLoopBackOff pod in production",
      "Add structured JSON logging to a Spring Boot app with trace ID included in every log line"
    ]
  },

  /* ════════════════════════════
     PHASE 7: TESTING & SECURITY
  ════════════════════════════ */
  {
    id:"testing", label:"Testing & Quality", phase:"testing",
    title:"Testing strategy: unit, integration, and end-to-end",
    why:"Untested code is a liability. Tests are not bureaucracy — they are the safety net that lets you refactor, upgrade dependencies, and deploy with confidence. Without them, every change is a gamble.",
    badges:[{t:"Quality",c:"b-scripting"}],
    prereqs:["Spring Boot — @SpringBootTest, @WebMvcTest","JPA — @DataJpaTest","Modern Java — streams, lambdas make mocking cleaner"],
    stages:[
      {label:"Beginner",items:[
        "Unit test anatomy: Arrange, Act, Assert (AAA pattern)",
        "JUnit 5: @Test, @BeforeEach, @AfterEach, @ParameterizedTest, @DisplayName",
        "Assertions: assertEquals, assertThrows, assertThat (AssertJ) — use AssertJ for readability",
        "Mockito: @Mock, @InjectMocks, when().thenReturn(), verify()",
        "Test doubles: mock vs stub vs spy vs fake — know the distinctions",
        "Test naming: given_condition_when_action_then_result — communicates intent"
      ]},
      {label:"Intermediate",items:[
        "@WebMvcTest: test controller layer in isolation, MockMvc for HTTP assertions",
        "@DataJpaTest: test repository layer with H2 or TestContainers",
        "@SpringBootTest: full application context — slow, use sparingly",
        "TestContainers: real PostgreSQL/Redis/Kafka in tests — no more H2 dialect mismatches",
        "Test coverage: JaCoCo — 80% is a floor, not a goal; 100% is theater",
        "Mutation testing: PIT — verifies your tests actually catch bugs, not just execute code",
        "Contract testing: Pact — consumer-driven contracts for microservices"
      ]},
      {label:"Advanced",items:[
        "Architecture testing: ArchUnit — enforce layer dependencies, naming conventions in tests",
        "Performance testing: JMH for micro-benchmarks, Gatling/k6 for load testing",
        "Chaos engineering: Chaos Monkey, Toxiproxy — test resilience of dependencies",
        "Test pyramid vs test trophy: know both models, choose based on your system",
        "BDD: Cucumber with Gherkin — when behavior-driven tests add value vs bureaucracy",
        "Test data management: factories, fixtures, builders — avoid copy-paste test setup",
        "Flaky tests: the silent killer of CI pipelines — detection, quarantine, elimination"
      ]}
    ],
    projects:[
      "Achieve 80%+ coverage on a Spring Boot service with unit tests and @WebMvcTest — no @SpringBootTest",
      "Integration test suite with TestContainers: real PostgreSQL, real Redis, real Kafka",
      "Load test a REST API with Gatling: 1000 concurrent users, measure P95 latency, identify the bottleneck",
      "Add ArchUnit tests: enforce that @Service classes cannot depend on @Controller classes"
    ],
    usecases:[
      "TestContainers in CI: integration tests run against real containers, not mocked databases",
      "Contract tests: prevent consumer teams from breaking each other's APIs",
      "PIT mutation testing reveals that 80% coverage was false confidence — tests didn't cover edge cases"
    ],
    mistakes:[
      "Testing implementation details instead of behavior — tests break on every refactor",
      "Overusing @SpringBootTest — starts full context for every test, CI takes 20 minutes",
      "Mocking the class under test — testing the mock, not the code",
      "Not testing the unhappy path: null inputs, empty collections, invalid states — bugs live here"
    ],
    production:"Tests are the only thing standing between your code and production incidents. A well-tested codebase lets you deploy on Friday afternoon.",
    ready:[
      "Write a @WebMvcTest for a POST endpoint: test validation errors, success, and auth failure",
      "Set up TestContainers for a @DataJpaTest with PostgreSQL — no H2",
      "Explain the difference between mock, stub, spy, and fake — with a use case for each",
      "Run PIT mutation testing and interpret the results"
    ]
  },

  /* ════════════════════════════
     PHASE 8: PROJECTS
  ════════════════════════════ */
  {
    id:"projects_guide", label:"Project Guidance", phase:"projects",
    title:"Hands-on projects by level",
    why:"Reading without building is memorization, not learning. Each project forces a real design decision. The mistakes you make in projects are the lessons you carry into interviews and production.",
    badges:[{t:"Practice",c:"b-foundation"}],
    prereqs:["Complete at minimum Phase 1 (Fundamentals) before starting projects"],
    stages:[
      {label:"Beginner Projects",items:[
        "Library book management: CRUD with Spring Boot + H2 + validation — learn the basics end to end",
        "Student grade calculator: REST API, business logic, unit tests — get comfortable with the stack",
        "To-do list API: add, complete, delete tasks with user association — authentication basics",
        "Currency converter: call an external REST API, cache the exchange rate in Redis"
      ]},
      {label:"Intermediate Projects",items:[
        "E-commerce product catalog: PostgreSQL, full-text search, pagination, image upload to S3",
        "Blog platform with auth: JWT auth, roles (admin/author/reader), comment system, Kafka for notifications",
        "URL shortener: Redis for URL store, analytics with PostgreSQL, rate limiting, 301 vs 302 trade-off",
        "Ride-sharing backend (simplified): user location, driver matching, trip state machine, WebSocket updates"
      ]},
      {label:"Advanced Capstone",items:[
        "Payment service: idempotency keys, saga pattern, DLQ, exactly-once Kafka, PCI compliance checklist",
        "Distributed rate limiter: Redis Cluster, token bucket, 50ms SLA, horizontal scale, observability",
        "Event-sourced order system: CQRS, Kafka event log, replay from offset, multiple read model projections",
        "Social media feed: follow graph, fan-out strategies, celebrity problem, Redis cache, Elasticsearch search"
      ]}
    ],
    projects:[
      "For every project: write the design doc before writing code — what are the trade-offs?",
      "For every project: load test it with Gatling — where does it break?",
      "For every project: add Prometheus metrics and Grafana dashboard — you must observe what you build",
      "For every project: write a postmortem for the biggest architectural mistake you made"
    ],
    usecases:[
      "Interviewer asks 'tell me about a challenging project' — these give you real stories with real decisions",
      "Portfolio projects on GitHub with READMEs that explain architecture, trade-offs, and lessons learned",
      "Open-source contributions: find a Spring Boot or related project, fix a real bug"
    ],
    mistakes:[
      "Building CRUD apps endlessly — step 3 should have distributed systems concepts",
      "No tests in projects — you are rehearsing bad habits",
      "Not writing the design doc — you are training for a job where every feature starts with a doc"
    ],
    production:"Projects are your portfolio and your interview material. Build things that have real constraints, real trade-offs, and real failures. Those stories win interviews.",
    ready:[
      "Each project has a README with: architecture diagram, key design decisions, what you'd change at 10x scale",
      "Every project has >70% test coverage with integration tests using TestContainers",
      "Every project has a Dockerfile, GitHub Actions CI/CD, and Kubernetes manifests",
      "Every project has a load test result: QPS, P95 latency, breaking point"
    ]
  },

  /* ════════════════════════════
     PHASE 9: INTERVIEW PREP
  ════════════════════════════ */
  {
    id:"interview_java", label:"Core Java Questions", phase:"interviews",
    title:"Core Java interview questions",
    why:"Core Java questions are in every interview. These are not trick questions — they test whether you know the language you claim to use every day.",
    badges:[{t:"Interview",c:"b-sre"}],
    prereqs:["Java Core — all sections","JVM Internals","Modern Java"],
    stages:[
      {label:"Junior Level",items:[
        "1. What is the difference between == and .equals()? When does each return true?",
        "2. Explain the difference between String, StringBuilder, and StringBuffer. Which to use when?",
        "3. What is autoboxing and unboxing? What NullPointerException can it cause?",
        "4. What is the difference between ArrayList and LinkedList? Which is faster for random access?",
        "5. What does the 'final' keyword do on a variable, method, and class?",
        "6. What is the difference between checked and unchecked exceptions? Give examples.",
        "7. What is the purpose of the 'static' keyword? What are static fields and static methods?",
        "8. What is method overloading vs method overriding? How does the JVM resolve each?"
      ]},
      {label:"Mid Level",items:[
        "9. Explain the Java Memory Model and what the 'volatile' keyword guarantees.",
        "10. What is the difference between HashMap and ConcurrentHashMap? How does ConcurrentHashMap achieve thread safety?",
        "11. Explain the contract between equals() and hashCode(). What breaks if you violate it?",
        "12. What is a functional interface? Name 5 built-in functional interfaces in Java 8.",
        "13. What is the difference between Stream.map() and Stream.flatMap()? Give a real example.",
        "14. Explain type erasure in Java generics. What are the runtime implications?",
        "15. What is a deadlock? Write code that creates one and explain how to fix it.",
        "16. What is the difference between Comparable and Comparator? Which should you implement?"
      ]},
      {label:"Senior Level",items:[
        "17. Explain G1GC collection process: Eden → Survivor → Old generation promotion. When does a Full GC occur?",
        "18. What is the Java Memory Model's happens-before relationship? How does synchronized establish it?",
        "19. Explain the CAS (Compare-And-Swap) operation. How does AtomicInteger use it? What is the ABA problem?",
        "20. What is the difference between CountDownLatch, CyclicBarrier, and Semaphore? Give a use case for each.",
        "21. How do virtual threads (Java 21) differ from platform threads? What problem do they solve?",
        "22. Explain sealed classes and pattern matching. What problem in the type system do they solve?",
        "23. You have a memory leak in production. Walk me through your investigation process end to end.",
        "24. How does the JVM's escape analysis optimization work? What code patterns trigger it?"
      ]}
    ],
    projects:["For each question: can you answer it without preparation? If not, that's a gap."],
    usecases:["Every Core Java question is a proxy for 'do you understand the tool you use every day?'"],
    mistakes:["Memorizing answers without understanding — follow-up probes will expose it"],
    production:"Core Java knowledge is the baseline. Weak answers here signal weak production code quality.",
    ready:["Answer all 24 questions above without preparation","For each answer, provide a real-world scenario where it matters in production"]
  },

  {
    id:"interview_system_design", label:"System Design Questions", phase:"interviews",
    title:"System design interview questions",
    why:"System design rounds determine your level at most companies. Junior → Mid is DSA. Mid → Senior is system design. Senior → Staff is distributed system design. Practice here is non-negotiable.",
    badges:[{t:"Interview",c:"b-sre"}],
    prereqs:["System Design — all topics","Databases — SQL and NoSQL","Messaging — Kafka"],
    stages:[
      {label:"Mid Level",items:[
        "1. Design a URL shortener: 100M URLs, 1B redirects/day. What data store, what cache?",
        "2. Design a REST API rate limiter: 1000 req/min per user, distributed across 10 servers.",
        "3. Design a simple notification system: send email + push for 10M users. What's the fan-out strategy?",
        "4. Given this slow SQL query, how would you optimize it? (Interviewer shows EXPLAIN output)"
      ]},
      {label:"Senior Level",items:[
        "5. Design Twitter's home timeline for 500M users including celebrities with 50M followers.",
        "6. Design a payment processing system: idempotency, ACID across services, fraud detection.",
        "7. Design a distributed job scheduler: run cron-like jobs exactly once at scale, fault tolerant.",
        "8. Design a real-time collaborative document editor (like Google Docs) for 10M concurrent users.",
        "9. Your Kafka consumer is lagging 6 hours behind. Walk me through diagnosing and resolving it.",
        "10. Design a CQRS + Event Sourcing system for an order management platform."
      ]},
      {label:"Follow-up Probes",items:[
        "Follow-up: 'What happens if the cache is cold and you get 10x traffic?' (Cache stampede problem)",
        "Follow-up: 'How do you ensure no duplicate payments if the API is called twice?' (Idempotency)",
        "Follow-up: 'If your primary database goes down, what's your failover strategy?' (RTO/RPO)",
        "Follow-up: 'How would your design change if this needs to work in 5 geographic regions?' (Multi-region)",
        "Follow-up: 'What monitoring and alerting would you add on day 1?' (SLO-driven observability)"
      ]}
    ],
    projects:[
      "Time yourself: 45 minutes per design, then compare to reference solutions",
      "Practice estimation: QPS, storage, bandwidth — before the whiteboard",
      "Write design docs for 5 systems — interviewers notice engineers who think in written structure"
    ],
    usecases:["System design questions test architectural maturity — how you think, not just what you know"],
    mistakes:[
      "Starting to code immediately — always clarify requirements, constraints, and scale first",
      "Designing for 1 billion users from minute one — ask about actual current scale",
      "Not justifying your choices — 'I'd use Kafka' without 'because...' fails senior-level bars"
    ],
    production:"System design skills are directly applicable to your job. Every new feature starts with a design doc.",
    ready:[
      "Complete 10 system design problems on a timer with post-mortem analysis",
      "For each design: QPS estimate, data model, API design, scalability approach, failure modes",
      "Peer review your designs with another engineer — their questions reveal your blind spots"
    ]
  },

  {
    id:"interview_behavioral", label:"Behavioral Questions", phase:"interviews",
    title:"Behavioral and ownership mindset questions",
    why:"Technical skills get you the interview. Behavioral answers get you the offer. Senior engineers are evaluated heavily on ownership, judgment under pressure, and how they operate in teams.",
    badges:[{t:"Interview",c:"b-sre"}],
    prereqs:["Real experience — these questions require stories, not theory"],
    stages:[
      {label:"Junior Level",items:[
        "1. Tell me about a bug you introduced in production. How did you find it and fix it?",
        "2. Describe a situation where you disagreed with a teammate. How did you resolve it?",
        "3. Tell me about a time you learned a new technology quickly under pressure.",
        "4. Describe a project you are proud of. What was your specific contribution?"
      ]},
      {label:"Mid Level",items:[
        "5. Tell me about a time you had to make a technical decision with incomplete information. What did you do?",
        "6. Describe a time you improved a process or system that was slowing down the team.",
        "7. Tell me about a time you had to push back on a feature request. How did you communicate it?",
        "8. Describe a postmortem you led. What action items came out of it and were they completed?",
        "9. Tell me about a time you had to mentor a junior engineer. What was the outcome?"
      ]},
      {label:"Senior Level",items:[
        "10. Tell me about a system you designed that failed at scale. What did you miss and what did you change?",
        "11. Describe a time you had to align multiple teams on a technical direction they disagreed on.",
        "12. Tell me about a time you identified a technical risk before it became an incident. What did you do?",
        "13. Describe a time you had to make a trade-off between technical quality and delivery speed. How did you decide?",
        "14. Tell me about the most complex bug you've ever debugged. Walk me through your investigation."
      ]}
    ],
    projects:[
      "Prepare STAR stories for every question above: Situation, Task, Action, Result — with metrics",
      "For every story: what would you do differently? Interviewers respect self-awareness.",
      "Record yourself answering — you will be surprised how different you sound vs how you think"
    ],
    usecases:[
      "Amazon LP questions require specific stories — not generic platitudes",
      "Every Principal/Staff level requires ownership stories — technical alone does not get you there"
    ],
    mistakes:[
      "Vague answers: 'we worked together as a team' — no, what did YOU specifically do?",
      "No metric in the result: 'it improved performance' — by how much? over what period?",
      "Negative framing of colleagues in conflict stories — always own your part"
    ],
    production:"Behavioral mastery is what converts a technical hire into a leadership track engineer.",
    ready:[
      "Have 3 strong STAR stories for each behavioral category — failure, conflict, ownership, mentoring, technical decision",
      "Every story has a measurable result",
      "Practice saying 'I' not 'we' — own your contributions explicitly"
    ]
  }

]; /* end TOPICS */
