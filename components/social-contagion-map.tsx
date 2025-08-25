"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface Node {
  id: string
  x: number
  y: number
  radius: number
  color: string
  label: string
  riskLevel: "low" | "medium" | "high"
  connections: string[]
}

export function SocialContagionMap() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    // Initialize network nodes
    const initialNodes: Node[] = [
      {
        id: "user",
        x: 300,
        y: 200,
        radius: 20,
        color: "#00F5FF",
        label: "You",
        riskLevel: "low",
        connections: ["advisor1", "friend1", "platform1"],
      },
      {
        id: "advisor1",
        x: 150,
        y: 100,
        radius: 15,
        color: "#FFD700",
        label: "Investment Advisor",
        riskLevel: "low",
        connections: ["user", "client1", "client2"],
      },
      {
        id: "friend1",
        x: 450,
        y: 150,
        radius: 12,
        color: "#22c55e",
        label: "Friend",
        riskLevel: "low",
        connections: ["user", "friend2"],
      },
      {
        id: "platform1",
        x: 200,
        y: 350,
        radius: 18,
        color: "#ef4444",
        label: "Suspicious Platform",
        riskLevel: "high",
        connections: ["user", "scammer1", "victim1"],
      },
      {
        id: "scammer1",
        x: 100,
        y: 300,
        radius: 14,
        color: "#ef4444",
        label: "Known Scammer",
        riskLevel: "high",
        connections: ["platform1", "victim1", "victim2"],
      },
      {
        id: "client1",
        x: 80,
        y: 150,
        radius: 10,
        color: "#FFD700",
        label: "Client A",
        riskLevel: "medium",
        connections: ["advisor1"],
      },
      {
        id: "client2",
        x: 120,
        y: 50,
        radius: 10,
        color: "#FFD700",
        label: "Client B",
        riskLevel: "low",
        connections: ["advisor1"],
      },
      {
        id: "friend2",
        x: 500,
        y: 100,
        radius: 10,
        color: "#22c55e",
        label: "Friend's Friend",
        riskLevel: "low",
        connections: ["friend1"],
      },
      {
        id: "victim1",
        x: 150,
        y: 400,
        radius: 12,
        color: "#eab308",
        label: "Potential Victim",
        riskLevel: "medium",
        connections: ["platform1", "scammer1"],
      },
      {
        id: "victim2",
        x: 50,
        y: 380,
        radius: 10,
        color: "#ef4444",
        label: "Confirmed Victim",
        riskLevel: "high",
        connections: ["scammer1"],
      },
    ]
    setNodes(initialNodes)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      nodes.forEach((node) => {
        node.connections.forEach((connectionId) => {
          const connectedNode = nodes.find((n) => n.id === connectionId)
          if (connectedNode) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connectedNode.x, connectedNode.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Node circle
        ctx.fillStyle = node.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()

        // Node border
        ctx.strokeStyle = selectedNode?.id === node.id ? "#ffffff" : "rgba(255, 255, 255, 0.3)"
        ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1
        ctx.stroke()

        // Node label
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Inter"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y + node.radius + 15)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes, selectedNode])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const clickedNode = nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance <= node.radius
    })

    setSelectedNode(clickedNode || null)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle>Social Contagion Network Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative bg-black/20 rounded-lg p-4 border border-border">
              <canvas
                ref={canvasRef}
                width={600}
                height={450}
                className="w-full h-auto cursor-pointer"
                onClick={handleCanvasClick}
              />
              <div className="absolute top-4 right-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>High Risk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedNode ? (
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold mb-3">Node Details</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <div className="font-medium">{selectedNode.label}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risk Level:</span>
                    <div className={`font-medium capitalize ${getRiskColor(selectedNode.riskLevel)}`}>
                      {selectedNode.riskLevel}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Connections:</span>
                    <div className="font-medium">{selectedNode.connections.length}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Connected to:</span>
                    <div className="mt-1 space-y-1">
                      {selectedNode.connections.map((connectionId) => {
                        const connectedNode = nodes.find((n) => n.id === connectionId)
                        return connectedNode ? (
                          <div key={connectionId} className="text-xs bg-muted/50 px-2 py-1 rounded">
                            {connectedNode.label}
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold mb-2">Network Overview</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Click on any node to view detailed information about connections and risk levels.</p>
                  <p>Red nodes indicate high-risk entities that may be involved in fraudulent activities.</p>
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h4 className="font-semibold mb-2">Risk Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Nodes:</span>
                  <span className="font-medium">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>High Risk:</span>
                  <span className="text-red-400 font-medium">{nodes.filter((n) => n.riskLevel === "high").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Risk:</span>
                  <span className="text-yellow-400 font-medium">
                    {nodes.filter((n) => n.riskLevel === "medium").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Low Risk:</span>
                  <span className="text-green-400 font-medium">
                    {nodes.filter((n) => n.riskLevel === "low").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
