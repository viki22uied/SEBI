"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface TrustedContact {
  id: string
  name: string
  email: string
  phone: string
  relationship: string
  alertsEnabled: boolean
}

export function TrustedContacts() {
  const [contacts, setContacts] = useState<TrustedContact[]>([
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43210",
      relationship: "Spouse",
      alertsEnabled: true,
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      email: "rajesh.k@email.com",
      phone: "+91 87654 32109",
      relationship: "Financial Advisor",
      alertsEnabled: true,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
  })

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()
    const contact: TrustedContact = {
      id: Date.now().toString(),
      ...newContact,
      alertsEnabled: true,
    }
    setContacts([...contacts, contact])
    setNewContact({ name: "", email: "", phone: "", relationship: "" })
    setShowAddForm(false)
  }

  const toggleAlerts = (id: string) => {
    setContacts(
      contacts.map((contact) => (contact.id === id ? { ...contact, alertsEnabled: !contact.alertsEnabled } : contact)),
    )
  }

  const removeContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm border border-border luxury-transition">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trusted Contacts</span>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground luxury-transition"
          >
            {showAddForm ? "Cancel" : "Add Contact"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <form onSubmit={handleAddContact} className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  required
                  className="luxury-transition focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  placeholder="e.g., Family, Friend, Advisor"
                  required
                  className="luxury-transition focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  required
                  className="luxury-transition focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  required
                  className="luxury-transition focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <Button type="submit" className="w-full luxury-transition">
              Add Trusted Contact
            </Button>
          </form>
        )}

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-lg bg-muted/30 border border-border luxury-transition hover:bg-muted/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                      {contact.relationship}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>{contact.email}</div>
                    <div>{contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={contact.alertsEnabled ? "default" : "outline"}
                    onClick={() => toggleAlerts(contact.id)}
                    className="text-xs luxury-transition"
                  >
                    {contact.alertsEnabled ? "Alerts On" : "Alerts Off"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeContact(contact.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 luxury-transition"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No trusted contacts added yet.</p>
            <p className="text-sm mt-1">Add contacts who should be alerted about suspicious activities.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
