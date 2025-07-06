"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import type * as THREE from "three"

interface AvatarProps {
  isListening: boolean
  isSpeaking: boolean
}

function AvatarMesh({ isListening, isSpeaking }: AvatarProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const eyesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing animation
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02

      // Speaking animation
      if (isSpeaking) {
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.05
      }
    }

    // Eye blinking
    if (eyesRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 3)
      if (blinkTime > 0.95) {
        eyesRef.current.scale.y = 0.1
      } else {
        eyesRef.current.scale.y = 1
      }
    }
  })

  return (
    <group>
      {/* Head */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={isListening ? "#4ade80" : isSpeaking ? "#3b82f6" : "#e2e8f0"}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Eyes */}
      <group ref={eyesRef}>
        <mesh position={[-0.3, 0.2, 1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.3, 0.2, 1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* Mouth */}
      <mesh position={[0, -0.3, 1]}>
        <sphereGeometry args={[isSpeaking ? 0.2 : 0.1, 16, 16]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Status indicator */}
      {isListening && (
        <mesh position={[0, 2, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.6} />
        </mesh>
      )}

      {isSpeaking && (
        <group position={[0, 2, 0]}>
          <mesh>
            <ringGeometry args={[0.6, 0.8, 32]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.9, 1.1, 32]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export function Avatar3D({ isListening, isSpeaking }: AvatarProps) {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <AvatarMesh isListening={isListening} isSpeaking={isSpeaking} />

        <Environment preset="studio" />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-center">
          <p className="text-white text-sm">
            {isListening ? "🎤 Listening..." : isSpeaking ? "🗣️ Speaking..." : "💭 Thinking..."}
          </p>
        </div>
      </div>
    </div>
  )
}
