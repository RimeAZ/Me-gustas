import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

/* ============================================================
   El texto exacto de la carta para Rallada
   ============================================================ */
const PARRAFOS = [
  'Oye, bonita tarde, ¿no? Espero que la estés pasando bien, que el sol no te haya dado muy fuerte pero que te haya calentado el ánimo. Las tardes tienen algo especial, como que invitan a parar el mundo un ratito y a pensar en las personas que importan.',
  'Precisamente hoy, en esta tarde tranquila, me acordé de ti, rallada. De esas tardes nuestras en las que el reloj parecía no importarnos, cuando nos quedábamos horas hablando hasta que ya casi era de noche. Te echo de menos, rallada. Echo de menos tus ocurrencias, cómo me haces ver las cosas de otra manera, y eso que a veces ni te das cuenta.',
  'Ojalá pronto podamos coincidir en una tarde como esta, sentarnos a platicar sin prisa, contarnos lo que ha pasado, reírnos de lo viejo y planear lo nuevo. Mientras tanto, cuídate mucho, come algo rico, pon música si te apetece, y que esta tarde te sepa a poquito de todo lo bueno que te deseo.',
  'Buenas tardes, rallada. Te mando un abrazo grande, de esos que duran más de lo normal.',
]

/* ============================================================
   Geometría de corazón 3D (extruida desde una THREE.Shape)
   ============================================================ */
function createHeartGeometry() {
  const x = 0
  const y = 0
  const shape = new THREE.Shape()
  shape.moveTo(x + 0.25, y + 0.25)
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y)
  shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35)
  shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 0.95)
  shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35)
  shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y)
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.07,
    bevelThickness: 0.07,
  })
  geometry.center()
  geometry.scale(1, -1, 1) // que la punta del corazón mire hacia abajo
  return geometry
}

/* ============================================================
   Un corazón individual orbitando lentamente
   ============================================================ */
function OrbitingHeart({ radius, speed, height, phase, scale, color }) {
  const ref = useRef()
  const geometry = useMemo(() => createHeartGeometry(), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + phase
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = height + Math.sin(t * 1.5) * 0.4
    ref.current.rotation.y = t + Math.PI / 2
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.2
  })

  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshStandardMaterial
        color={color}
        roughness={0.25}
        metalness={0.15}
        emissive={color}
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

function OrbitingHearts() {
  const hearts = useMemo(
    () => [
      { radius: 3.6, speed: 0.18, height: 0.4, phase: 0, scale: 0.55, color: '#ff7a59' },
      { radius: 4.2, speed: -0.14, height: -0.6, phase: 2.1, scale: 0.42, color: '#ff9aa2' },
      { radius: 3.2, speed: 0.22, height: 1.0, phase: 4.0, scale: 0.5, color: '#ff6b6b' },
      { radius: 4.6, speed: -0.1, height: 0.2, phase: 1.0, scale: 0.38, color: '#ffb3a7' },
      { radius: 3.9, speed: 0.16, height: -1.1, phase: 5.2, scale: 0.46, color: '#ff8566' },
      { radius: 4.9, speed: -0.12, height: 1.3, phase: 3.1, scale: 0.34, color: '#ffa07a' },
    ],
    []
  )

  return (
    <group>
      {hearts.map((h, i) => (
        <OrbitingHeart key={i} {...h} />
      ))}
    </group>
  )
}

/* ============================================================
   Rosa 3D modelada (capas de pétalos + tallo)
   ============================================================ */
function Rose({ position, scale = 1, swayPhase = 0, swayAmount = 0.12 }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // suave vaivén lateral, como una brisa de tarde
    ref.current.rotation.z = Math.sin(t * 0.6 + swayPhase) * swayAmount
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + swayPhase) * 0.08
  })

  // varias capas de pétalos en espiral
  const petals = useMemo(() => {
    const layers = [
      { count: 5, radius: 0.18, tilt: 0.9, y: 0.34, size: 0.22 },
      { count: 6, radius: 0.3, tilt: 0.7, y: 0.26, size: 0.26 },
      { count: 7, radius: 0.42, tilt: 0.5, y: 0.18, size: 0.3 },
    ]
    const list = []
    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        const a = (i / layer.count) * Math.PI * 2 + li * 0.5
        list.push({
          x: Math.cos(a) * layer.radius,
          z: Math.sin(a) * layer.radius,
          y: layer.y,
          rotY: -a,
          tilt: layer.tilt,
          size: layer.size,
        })
      }
    })
    return list
  }, [])

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* botón central */}
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#c0392b" roughness={0.4} />
      </mesh>

      {/* pétalos */}
      {petals.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, p.y, p.z]}
          rotation={[p.tilt, p.rotY, 0]}
        >
          <sphereGeometry args={[p.size, 14, 14, 0, Math.PI]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#e74c3c' : '#ff6b6b'}
            roughness={0.45}
            metalness={0.05}
            side={THREE.DoubleSide}
            emissive="#7a1f17"
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}

      {/* tallo */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.9, 8]} />
        <meshStandardMaterial color="#3e7d3a" roughness={0.6} />
      </mesh>

      {/* hojas */}
      <mesh position={[0.18, -0.25, 0]} rotation={[0, 0, -0.7]}>
        <sphereGeometry args={[0.16, 10, 10, 0, Math.PI]} />
        <meshStandardMaterial color="#4caf50" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.18, -0.4, 0]} rotation={[0, Math.PI, 0.7]}>
        <sphereGeometry args={[0.14, 10, 10, 0, Math.PI]} />
        <meshStandardMaterial color="#4caf50" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Roses() {
  return (
    <group>
      {/* tres rosas en los laterales inferiores */}
      <Rose position={[-4.6, -2.6, 0.5]} scale={1.1} swayPhase={0} />
      <Rose position={[4.6, -2.7, 0.3]} scale={1.0} swayPhase={1.6} />
      <Rose position={[-3.4, -3.0, 1.4]} scale={0.8} swayPhase={3.0} swayAmount={0.16} />
      <Rose position={[3.6, -3.1, 1.2]} scale={0.85} swayPhase={2.2} swayAmount={0.15} />
    </group>
  )
}

/* ============================================================
   La escena 3D completa
   ============================================================ */
function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* luz cálida de atardecer */}
      <ambientLight intensity={0.7} color="#fff1e0" />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffd9a0" />
      <pointLight position={[-5, -2, 4]} intensity={0.6} color="#ff9a8b" />

      {/* motas de polvo de sol doradas */}
      <Sparkles
        count={120}
        scale={[16, 10, 6]}
        size={3}
        speed={0.25}
        opacity={0.7}
        color="#ffd27a"
      />
      <Sparkles
        count={60}
        scale={[14, 9, 5]}
        size={5}
        speed={0.15}
        opacity={0.5}
        color="#fff4d6"
      />

      {/* corazones orbitando suavemente */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
        <OrbitingHearts />
      </Float>

      {/* rosas en los laterales */}
      <Roses />
    </Canvas>
  )
}

/* ============================================================
   Capa HTML de pétalos cayendo (muy suave, con cuentagotas)
   ============================================================ */
function FallingPetals() {
  const petals = useMemo(() => {
    const arr = []
    const count = 14
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 18,
        duration: 16 + Math.random() * 12,
        size: 14 + Math.random() * 16,
        drift: (Math.random() - 0.5) * 120,
        rotate: Math.random() * 360,
        hue: Math.random() > 0.5 ? '#ff9aa2' : '#ffb07a',
      })
    }
    return arr
  }, [])

  return (
    <div className="petals-layer" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--rot': `${p.rotate}deg`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 32 32">
            <path
              d="M16 2 C24 8 30 16 16 30 C2 16 8 8 16 2 Z"
              fill={p.hue}
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
    </div>
  )
}

/* ============================================================
   Corazones de fondo estáticos, opacidad baja
   ============================================================ */
function BackgroundHearts() {
  const hearts = useMemo(() => {
    const arr = []
    for (let i = 0; i < 10; i++) {
      arr.push({
        id: i,
        top: Math.random() * 90,
        left: Math.random() * 95,
        size: 20 + Math.random() * 40,
        opacity: 0.05 + Math.random() * 0.1,
        delay: Math.random() * 6,
      })
    }
    return arr
  }, [])

  return (
    <div className="bg-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="bg-heart"
          style={{
            top: `${h.top}%`,
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animationDelay: `${h.delay}s`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}

/* ============================================================
   App principal
   ============================================================ */
export default function App() {
  // pequeño splash de bienvenida que se desvanece solo (sin botón de entrar)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="app">
      {/* Fondo degradado de atardecer */}
      <div className="sunset-bg" />
      <div className="sun-glow" />

      {/* Nubes suaves en las esquinas superiores */}
      <div className="cloud cloud-left" aria-hidden="true" />
      <div className="cloud cloud-right" aria-hidden="true" />

      {/* Corazones de fondo */}
      <BackgroundHearts />

      {/* Escena 3D (detrás del texto, cubre todo el viewport) */}
      <div className="scene-layer">
        <Scene />
      </div>

      {/* Pétalos cayendo (capa HTML, encima de la 3D pero detrás de la tarjeta) */}
      <FallingPetals />

      {/* Decoración fija en las esquinas: ositos y corazones */}
      <span className="corner corner-tl" aria-hidden="true">🧸</span>
      <span className="corner corner-tr" aria-hidden="true">💛</span>
      <span className="corner corner-bl" aria-hidden="true">🌹</span>
      <span className="corner corner-br" aria-hidden="true">🧸</span>

      {/* Contenido principal: la carta */}
      <main className="content">
        <motion.section
          className="letter-card"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="letter-title"
            initial={{ opacity: 0, y: 10 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Buenas tardes, rallada <span className="title-emoji">🌅</span>
          </motion.h1>

          <div className="letter-body">
            {PARRAFOS.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={revealed ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.7 + i * 0.45 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="signature"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={revealed ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.7 + PARRAFOS.length * 0.45 }}
          >
            <span className="signature-line" />
            <span className="signature-name">Rallada Rallada</span>
            <span className="signature-line" />
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}
