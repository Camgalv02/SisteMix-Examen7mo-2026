/* ═══════════════════════════════════════════════════════
   DATOS DEL ROSCO: banco de preguntas + glosario
   Este archivo se carga ANTES que script.js
   ═══════════════════════════════════════════════════════ */

const LETRAS=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

/* ───────── BANCO DE PREGUNTAS ─────────
   r: "empieza" | "contiene"   t: texto de la pista
   s: respuesta que se muestra  a: respuestas aceptadas */
const BANCO={
  A:[
    {r:"empieza",t:"Secuencia ordenada y finita de pasos que permite resolver un problema o realizar una tarea.",s:"ALGORITMO",a:["algoritmo"]},
    {r:"empieza",t:"Proceso de simplificar la realidad seleccionando solo las variables relevantes para construir un modelo.",s:"ABSTRACCIÓN",a:["abstraccion","abstracción"]},
    {r:"empieza",t:"En un grafo, línea que une dos nodos; puede tener un peso que representa distancia o costo.",s:"ARISTA",a:["arista"]},
    {r:"empieza",t:"En un diagrama de casos de uso (UML), persona o sistema externo que interactúa con el sistema modelado.",s:"ACTOR",a:["actor"]},
  ],
  B:[
    {r:"empieza",t:"Conjunto organizado de datos almacenados en tablas, que permite guardar y consultar información.",s:"BASE DE DATOS",a:["base de datos","basededatos","base","bd"]},
    {r:"empieza",t:"Tipo de lógica que solo trabaja con dos valores: verdadero o falso.",s:"BOOLEANA",a:["booleana","logica booleana","lógica booleana"]},
    {r:"empieza",t:"Notación estándar para representar gráficamente los procesos de un negocio u organización.",s:"BPMN",a:["bpmn"]},
  ],
  C:[
    {r:"empieza",t:"Clave secreta que protege el acceso a una cuenta; para ser segura debe combinar letras, números y símbolos.",s:"CONTRASEÑA",a:["contraseña","contrasena","clave"]},
    {r:"empieza",t:"En UML, conjunto de objetos que comparten los mismos atributos y métodos.",s:"CLASE",a:["clase"]},
    {r:"empieza",t:"Computadora o programa que solicita servicios a un servidor dentro de una red.",s:"CLIENTE",a:["cliente"]},
  ],
  D:[
    {r:"empieza",t:"Representación gráfica que muestra, mediante símbolos estandarizados, la secuencia de pasos de un algoritmo o proceso.",s:"DIAGRAMA DE FLUJO",a:["diagrama de flujo","diagramadeflujo","diagrama","flujograma"]},
    {r:"empieza",t:"Mínima unidad de información sin procesar ni interpretar.",s:"DATO",a:["dato"]},
    {r:"empieza",t:"Algoritmo que calcula la ruta más corta desde un nodo origen hacia todos los demás nodos en un grafo de pesos no negativos.",s:"DIJKSTRA",a:["dijkstra"]},
  ],
  E:[
    {r:"empieza",t:"En la teoría de sistemas, conjunto de elementos externos que rodean a un sistema y pueden influir sobre él.",s:"ENTORNO",a:["entorno"]},
    {r:"empieza",t:"Fase de un sistema en la que se introducen los datos que luego serán procesados.",s:"ENTRADA",a:["entrada"]},
    {r:"empieza",t:"Tipo de sistema cuyo comportamiento incluye un componente de azar o probabilidad.",s:"ESTOCÁSTICO",a:["estocastico","estocástico"]},
  ],
  F:[
    {r:"empieza",t:"Relación matemática en la que a cada valor de entrada le corresponde exactamente un valor de salida.",s:"FUNCIÓN",a:["funcion","función"]},
    {r:"empieza",t:"En una tabla de base de datos, cada registro horizontal que agrupa todos los datos de un elemento.",s:"FILA",a:["fila","registro"]},
  ],
  G:[{r:"empieza",t:"Estructura matemática formada por nodos (vértices) y aristas (conexiones), que sirve para modelar redes, rutas y relaciones.",s:"GRAFO",a:["grafo"]}],
  H:[{r:"empieza",t:"Conjunto de componentes físicos y tangibles de una computadora, como el teclado, el monitor o el disco duro.",s:"HARDWARE",a:["hardware"]}],
  I:[
    {r:"empieza",t:"Red mundial que conecta millones de computadoras y permite compartir información a nivel global.",s:"INTERNET",a:["internet"]},
    {r:"empieza",t:"Red privada que usa tecnología de internet pero está limitada al uso interno de una organización.",s:"INTRANET",a:["intranet"]},
    {r:"empieza",t:"Conjunto de datos procesados y organizados que tienen significado y resultan útiles para la toma de decisiones.",s:"INFORMACIÓN",a:["informacion","información"]},
  ],
  J:[{r:"contiene",t:"Lenguaje de programación orientado a objetos muy utilizado para desarrollar aplicaciones; no confundir con JavaScript.",s:"JAVA",a:["java"]}],
  K:[{r:"contiene",t:"Unidad de medida de almacenamiento de información equivalente a 1024 bytes.",s:"KILOBYTE",a:["kilobyte","kb"]}],
  L:[
    {r:"empieza",t:"Sigla que designa una red de área local: conecta computadoras dentro de un mismo edificio u oficina.",s:"LAN",a:["lan","red de area local","red de área local"]},
    {r:"empieza",t:"Frontera que separa a un sistema de su entorno y define qué elementos forman parte de él.",s:"LÍMITE",a:["limite","límite"]},
  ],
  M:[
    {r:"empieza",t:"Representación simplificada de la realidad que permite estudiar y comprender el comportamiento de un sistema.",s:"MODELO",a:["modelo"]},
    {r:"empieza",t:"En una clase de UML, acción o comportamiento que pueden realizar los objetos de esa clase.",s:"MÉTODO",a:["metodo","método"]},
  ],
  N:[
    {r:"empieza",t:"Operador lógico que invierte el valor de una proposición: si es verdadera la convierte en falsa, y viceversa.",s:"NOT (NEGACIÓN)",a:["not","negacion","negación"]},
    {r:"empieza",t:"Punto o vértice en un grafo; puede representar una ciudad, un equipo de red o cualquier entidad conectada.",s:"NODO",a:["nodo"]},
  ],
  Ñ:[{r:"contiene",t:"Etapa en la que se planifica la estructura y los componentes de un sistema antes de construirlo.",s:"DISEÑO",a:["diseño","diseno"]}],
  O:[
    {r:"empieza",t:"En la programación orientada a objetos y en UML, instancia concreta de una clase con atributos y comportamientos propios.",s:"OBJETO",a:["objeto"]},
    {r:"empieza",t:"Proceso de encontrar la mejor solución posible a un problema sujeto a restricciones de recursos; objetivo central en los problemas de transporte y rutas.",s:"OPTIMIZACIÓN",a:["optimizacion","optimización"]},
    {r:"empieza",t:"Operador lógico de disyunción que solo es falso cuando ambas proposiciones son falsas.",s:"OR (DISYUNCIÓN)",a:["or","disyuncion","disyunción"]},
  ],
  P:[
    {r:"empieza",t:"Enunciado que puede ser verdadero o falso, pero nunca ambas cosas a la vez; unidad básica de la lógica proposicional.",s:"PROPOSICIÓN",a:["proposicion","proposición"]},
    {r:"empieza",t:"Fase de un sistema en la que los datos de entrada se transforman para producir un resultado.",s:"PROCESO",a:["proceso"]},
    {r:"empieza",t:"Forma de escribir un algoritmo en lenguaje natural estructurado, antes de implementarlo en código real.",s:"PSEUDOCÓDIGO",a:["pseudocodigo","pseudocódigo"]},
  ],
  Q:[{r:"contiene",t:"Representación gráfica simplificada que muestra la estructura general de un sistema o proceso.",s:"ESQUEMA",a:["esquema"]}],
  R:[
    {r:"empieza",t:"Proceso por el cual la salida de un sistema vuelve a ingresar como entrada, permitiendo ajustar su funcionamiento.",s:"RETROALIMENTACIÓN",a:["retroalimentacion","retroalimentación","feedback"]},
    {r:"empieza",t:"Conjunto de computadoras y dispositivos conectados entre sí para compartir información y recursos.",s:"RED",a:["red"]},
    {r:"empieza",t:"Camino entre dos nodos de un grafo; algoritmos como Dijkstra calculan la ruta más corta o de menor costo.",s:"RUTA",a:["ruta","camino"]},
  ],
  S:[
    {r:"empieza",t:"Conjunto de elementos interrelacionados que trabajan juntos, dentro de un entorno y con límites definidos, para alcanzar un objetivo.",s:"SISTEMA",a:["sistema"]},
    {r:"empieza",t:"Computadora o programa que ofrece servicios o recursos a otros equipos (clientes) en una red.",s:"SERVIDOR",a:["servidor"]},
    {r:"empieza",t:"Estructura de control en la que las instrucciones se ejecutan una después de la otra, en el orden en que fueron escritas.",s:"SECUENCIAL",a:["secuencial"]},
    {r:"empieza",t:"Programas e instrucciones intangibles que controlan el funcionamiento del hardware de una computadora.",s:"SOFTWARE",a:["software"]},
  ],
  T:[
    {r:"empieza",t:"Herramienta que muestra todos los resultados posibles de una operación lógica entre proposiciones.",s:"TABLA DE VERDAD",a:["tabla de verdad","tabladeverdad","tabla"]},
    {r:"empieza",t:"En una base de datos, estructura organizada en filas (registros) y columnas (campos) para almacenar datos.",s:"TABLA",a:["tabla"]},
  ],
  U:[
    {r:"empieza",t:"Lenguaje estándar para modelar sistemas orientados a objetos, que incluye diagramas de clases, casos de uso y secuencia.",s:"UML",a:["uml"]},
    {r:"empieza",t:"Persona que utiliza un sistema informático y necesita credenciales seguras (nombre y contraseña) para acceder.",s:"USUARIO",a:["usuario"]},
  ],
  V:[{r:"empieza",t:"Espacio en la memoria de una computadora que almacena un valor capaz de cambiar durante la ejecución de un algoritmo.",s:"VARIABLE",a:["variable"]}],
  W:[{r:"empieza",t:"Sigla que designa una red de área amplia: conecta computadoras de distintas ciudades o países; Internet es el ejemplo más grande.",s:"WAN",a:["wan","red de area amplia","red de área amplia"]}],
  X:[{r:"contiene",t:"Combinación de proposiciones unidas mediante operadores lógicos (AND, OR, NOT) que produce un valor verdadero o falso.",s:"EXPRESIÓN LÓGICA",a:["expresion logica","expresión lógica","expresion","expresión"]}],
  Y:[{r:"empieza",t:"En lógica booleana, operador de conjunción equivalente a AND: solo es verdadero cuando ambas proposiciones lo son.",s:"Y (CONJUNCIÓN)",a:["y","and","conjuncion","conjunción"]}],
  Z:[{r:"contiene",t:"Formato de compresión que reduce el tamaño de archivos para facilitar su almacenamiento o envío.",s:"ZIP",a:["zip"]}],
};

/* ───────── GLOSARIO ───────── */
const UNIDADES={
  "U.0":{bg:"rgba(0,229,255,.15)",c:"#00e5ff"},
  "U.1":{bg:"rgba(77,121,255,.15)",c:"#6699ff"},
  "U.2":{bg:"rgba(176,77,255,.15)",c:"#c06bff"},
  "U.3":{bg:"rgba(255,140,26,.15)",c:"#ff9933"},
  "U.4":{bg:"rgba(255,210,63,.15)",c:"#ffd23f"},
  "U.5":{bg:"rgba(255,77,140,.15)",c:"#ff4d8c"},
  "U.6":{bg:"rgba(57,255,136,.15)",c:"#39ff88"},
  "—":{bg:"rgba(139,147,194,.1)",c:"#8b93c2"},
};

const GLOSARIO={
  A:[
    {t:"Abstracción",d:"Simplificación de la realidad para un modelo, conservando solo las variables relevantes.",u:"U.2"},
    {t:"Actor",d:"Persona o sistema externo que interactúa con el sistema modelado en un diagrama UML de casos de uso.",u:"U.4"},
    {t:"Algoritmo",d:"Secuencia ordenada y finita de pasos para resolver un problema o realizar una tarea.",u:"U.0"},
    {t:"AND / Conjunción",d:"Operador lógico booleano verdadero solo cuando ambas proposiciones son verdaderas.",u:"U.5"},
    {t:"Árbol de decisión",d:"Diagrama que muestra opciones y sus posibles consecuencias en forma ramificada.",u:"U.5"},
    {t:"Arista",d:"Línea que une dos nodos en un grafo; puede tener un peso (distancia, costo, capacidad).",u:"U.6"},
    {t:"Atributo",d:"Propiedad o característica de una clase en UML (ej: nombre, edad, precio).",u:"U.4"},
    {t:"Abierto (sistema)",d:"Sistema que intercambia materia, energía o información con su entorno.",u:"U.1"},
    {t:"Almacén de datos",d:"En un DFD, lugar donde se guarda información de manera persistente.",u:"U.3"},
  ],
  B:[
    {t:"Base de datos",d:"Conjunto organizado de datos almacenados en tablas relacionadas para facilitar su consulta.",u:"U.0"},
    {t:"BPMN",d:"Notación estándar para modelar gráficamente procesos de negocio (Business Process Model and Notation).",u:"U.3"},
    {t:"Booleano/a",d:"Relativo a la lógica de dos valores: verdadero (1) y falso (0).",u:"U.0"},
  ],
  C:[
    {t:"Camino (grafo)",d:"Secuencia de aristas que conectan nodos; base de los problemas de búsqueda de rutas.",u:"U.6"},
    {t:"Caso de uso",d:"Acción o función que un actor realiza con el sistema en un diagrama UML.",u:"U.4"},
    {t:"Ciberseguridad",d:"Conjunto de prácticas y tecnologías para proteger sistemas e información de ataques digitales.",u:"U.0"},
    {t:"Clase",d:"Plantilla que define los atributos y métodos comunes a un conjunto de objetos.",u:"U.4"},
    {t:"Cliente",d:"Computadora o programa que solicita servicios a un servidor en una red.",u:"U.0"},
    {t:"Columna",d:"En una tabla de base de datos, cada campo que define un atributo del registro.",u:"U.0"},
    {t:"Condicional",d:"Estructura de control que ejecuta instrucciones distintas según se cumpla o no una condición.",u:"U.0"},
    {t:"Contraseña",d:"Clave secreta que protege el acceso a una cuenta; debe ser larga y combinar caracteres variados.",u:"U.0"},
    {t:"Cerrado (sistema)",d:"Sistema que (teóricamente) no intercambia nada con su entorno.",u:"U.1"},
  ],
  D:[
    {t:"Dato",d:"Mínima unidad de información sin interpretar; en bruto (ej: el número 37 sin contexto).",u:"U.0"},
    {t:"DFD",d:"Diagrama de Flujo de Datos: muestra cómo fluye la información entre procesos, almacenes y entidades.",u:"U.3"},
    {t:"Determinista",d:"Sistema cuyo comportamiento futuro puede predecirse exactamente a partir de su estado actual.",u:"U.1"},
    {t:"Diagrama de clases",d:"Diagrama UML que muestra clases, atributos, métodos y relaciones entre ellas.",u:"U.4"},
    {t:"Diagrama de flujo",d:"Representación gráfica de un algoritmo o proceso mediante símbolos estandarizados.",u:"U.3"},
    {t:"Diagrama de secuencia",d:"Diagrama UML que muestra cómo interactúan los objetos a lo largo del tiempo.",u:"U.4"},
    {t:"Dijkstra",d:"Algoritmo que encuentra la ruta más corta desde un nodo origen hacia todos los demás en un grafo con pesos no negativos.",u:"U.6"},
    {t:"Dinámico (sistema)",d:"Sistema cuyo estado cambia continuamente con el tiempo.",u:"U.1"},
    {t:"Discreto (sistema)",d:"Sistema que cambia de estado en instantes específicos, no de forma continua.",u:"U.1"},
  ],
  E:[
    {t:"Ecuación",d:"Modelo matemático que expresa la igualdad entre dos expresiones con variables.",u:"U.5"},
    {t:"Entrada",d:"Datos o recursos que ingresan al sistema para ser procesados.",u:"U.0"},
    {t:"Entorno",d:"Conjunto de elementos externos que rodean al sistema y pueden influir sobre él.",u:"U.1"},
    {t:"Estocástico",d:"Sistema cuyo comportamiento incluye un componente aleatorio o probabilístico.",u:"U.1"},
  ],
  F:[
    {t:"Fila / Registro",d:"En una tabla de base de datos, cada fila es un registro completo de datos.",u:"U.0"},
    {t:"Flujo de datos",d:"Movimiento de información entre procesos, almacenes y entidades en un DFD.",u:"U.3"},
    {t:"Función",d:"Relación matemática que asigna a cada valor de entrada exactamente un valor de salida.",u:"U.5"},
  ],
  G:[{t:"Grafo",d:"Estructura formada por nodos (vértices) y aristas (conexiones); modela redes, relaciones y rutas.",u:"U.6"}],
  H:[{t:"Hardware",d:"Componentes físicos y tangibles de una computadora: CPU, disco, teclado, monitor, etc.",u:"U.0"}],
  I:[
    {t:"Información",d:"Datos procesados e interpretados que tienen significado y son útiles para tomar decisiones.",u:"U.0"},
    {t:"Internet",d:"Red mundial que interconecta millones de computadoras mediante protocolos estándar (TCP/IP).",u:"U.0"},
    {t:"Intranet",d:"Red privada interna de una organización que usa tecnología de internet.",u:"U.0"},
  ],
  J:[{t:"Java (contiene J)",d:"Lenguaje orientado a objetos muy usado. En el rosco aparece porque CONTIENE la J.",u:"—"}],
  K:[{t:"Kilobyte — KB (contiene K)",d:"Unidad de almacenamiento = 1024 bytes. En el rosco porque CONTIENE la K.",u:"—"}],
  L:[
    {t:"LAN",d:"Red de Área Local: conecta equipos dentro de un mismo edificio o campus.",u:"U.0"},
    {t:"Límite (de sistema)",d:"Frontera que separa al sistema de su entorno, definiendo qué elementos le pertenecen.",u:"U.1"},
    {t:"Lógica booleana",d:"Sistema formal que trabaja con verdadero/falso y operadores AND, OR, NOT.",u:"U.0"},
  ],
  M:[
    {t:"Método",d:"Acción o comportamiento que pueden realizar los objetos de una clase en UML.",u:"U.4"},
    {t:"Modelo",d:"Representación simplificada de la realidad para estudiar o predecir el comportamiento de un sistema.",u:"U.2"},
    {t:"Modelo computacional",d:"Modelo implementado en software que simula el comportamiento de un sistema real.",u:"U.2"},
    {t:"Modelo físico",d:"Modelo tangible que reproduce la realidad a escala reducida (maqueta, prototipo).",u:"U.2"},
    {t:"Modelo simbólico",d:"Modelo que usa símbolos, ecuaciones o diagramas en lugar de objetos físicos.",u:"U.2"},
  ],
  N:[
    {t:"Negación (NOT)",d:"Operador lógico que invierte el valor de verdad de una proposición.",u:"U.5"},
    {t:"Nodo",d:"Punto o vértice de un grafo; puede representar una ciudad, un equipo de red, un estado, etc.",u:"U.6"},
  ],
  Ñ:[{t:"Diseño (contiene Ñ)",d:"Etapa en que se planifica la estructura y los componentes de un sistema antes de construirlo.",u:"U.2"}],
  O:[
    {t:"Objeto",d:"Instancia concreta de una clase, con valores propios en sus atributos.",u:"U.4"},
    {t:"Optimización",d:"Proceso de encontrar la mejor solución posible a un problema sujeto a restricciones de recursos.",u:"U.6"},
    {t:"OR / Disyunción",d:"Operador lógico falso solo cuando ambas proposiciones son falsas.",u:"U.5"},
  ],
  P:[
    {t:"Proceso",d:"Etapa del sistema en que los datos de entrada se transforman para producir una salida.",u:"U.0"},
    {t:"Proposición",d:"Enunciado que puede ser verdadero o falso, pero nunca los dos a la vez.",u:"U.5"},
    {t:"Pseudocódigo",d:"Descripción de un algoritmo en lenguaje natural estructurado, previa a la codificación.",u:"U.0"},
  ],
  Q:[{t:"Esquema (e-s-qu-e-m-a)",d:"Representación gráfica simplificada de la estructura o funcionamiento de un sistema; contiene QU.",u:"U.2"}],
  R:[
    {t:"Red",d:"Conjunto de computadoras y dispositivos interconectados para compartir información y recursos.",u:"U.0"},
    {t:"Registro / Fila",d:"Cada fila de una tabla en una base de datos; contiene todos los datos de un elemento.",u:"U.0"},
    {t:"Relación (UML)",d:"Vínculo entre clases en un diagrama de clases (asociación, herencia, composición, etc.).",u:"U.4"},
    {t:"Repetitiva",d:"Estructura de control que repite instrucciones mientras se cumple una condición.",u:"U.0"},
    {t:"Retroalimentación",d:"Mecanismo por el que la salida de un sistema vuelve a influir en su entrada para autorregularlo.",u:"U.1"},
    {t:"Ruta",d:"Camino entre dos nodos de un grafo; los algoritmos como Dijkstra buscan la ruta más corta.",u:"U.6"},
  ],
  S:[
    {t:"Salida",d:"Resultado que entrega el sistema luego de procesar las entradas.",u:"U.0"},
    {t:"Secuencial",d:"Estructura de control en la que las instrucciones se ejecutan una tras otra, en orden.",u:"U.0"},
    {t:"Servidor",d:"Computadora o programa que ofrece servicios o recursos a los clientes de una red.",u:"U.0"},
    {t:"Sistema",d:"Conjunto de elementos interrelacionados que trabajan juntos para alcanzar un objetivo dentro de un entorno.",u:"U.1"},
    {t:"Sistema abierto",d:"Sistema que intercambia materia, energía o información con su entorno.",u:"U.1"},
    {t:"Sistema cerrado",d:"Sistema que (teóricamente) no intercambia nada con su entorno.",u:"U.1"},
    {t:"Software",d:"Programas e instrucciones intangibles que controlan el funcionamiento del hardware.",u:"U.0"},
    {t:"Subsistema",d:"Sistema contenido dentro de otro sistema mayor, con sus propios componentes y funciones.",u:"U.1"},
  ],
  T:[
    {t:"Tabla",d:"Estructura de base de datos con filas (registros) y columnas (campos o atributos).",u:"U.0"},
    {t:"Tabla de verdad",d:"Herramienta que muestra todos los valores posibles de una expresión lógica.",u:"U.5"},
    {t:"Tipo de dato",d:"Clasificación de los valores de una variable: entero, real, texto, booleano, etc.",u:"U.0"},
  ],
  U:[
    {t:"UML",d:"Lenguaje Unificado de Modelado: estándar para diseñar sistemas orientados a objetos mediante diagramas.",u:"U.4"},
    {t:"Usuario",d:"Persona que utiliza un sistema informático; necesita credenciales seguras para acceder.",u:"U.0"},
  ],
  V:[{t:"Variable",d:"Espacio en memoria que almacena un valor que puede cambiar durante la ejecución de un algoritmo.",u:"U.0"}],
  W:[{t:"WAN",d:"Red de Área Amplia: conecta redes locales de distintas ciudades o países; internet es la WAN más grande.",u:"U.0"}],
  X:[{t:"Expresión lógica (contiene X)",d:"Combinación de proposiciones y operadores lógicos (AND, OR, NOT) que produce V o F.",u:"U.5"}],
  Y:[{t:"Y / AND / Conjunción",d:"Operador booleano verdadero solo cuando ambas proposiciones son verdaderas.",u:"U.5"}],
  Z:[{t:"ZIP (contiene Z)",d:"Formato de compresión de archivos muy usado para reducir su tamaño.",u:"—"}],
};
