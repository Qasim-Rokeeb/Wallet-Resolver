
"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full bg-gradient-to-r from-primary to-accent p-0.5">
      <div className="bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
              The Future of Crypto Payments is Here
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
              Send and receive digital currency with just a phone number. No more complex addresses. Fast, secure, and incredibly simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link href="/#send">
                  Get Started
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#register">
                  Register Your Number
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center">
              <Image
                  src="https://placehold.co/550x400.png"
                  alt="Digital wallet illustration"
                  width={550}
                  height={400}
                  className="rounded-xl shadow-2xl w-full max-w-md"
                  data-ai-hint="digital wallet payment"
              />
          </div>
        </div>
      </div>
    </section>
  )
}
