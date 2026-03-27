'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init('phc_mPiIayEbYCGSuHEg6dg5nIWRlChQn6LBszYQWbITqWb', {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      loaded: (posthog) => {
        if (process.env.NODE_ENV !== 'production') posthog.opt_out_capturing()
      }
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
