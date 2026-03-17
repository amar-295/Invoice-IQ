"use client"

import { useState, useEffect } from "react"

export interface UserProfile {
    userId: string
    username: string
    email: string
}

export function useUser() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            method: "GET",
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Unauthenticated")
                return res.json() as Promise<UserProfile>
            })
            .then((data) => {
                if (!cancelled) setUser(data)
            })
            .catch(() => {
                if (!cancelled) setUser(null)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    return { user, loading }
}
