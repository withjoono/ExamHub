"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileText, BarChart3, GraduationCap, TrendingUp, Target, BookX,
  ClipboardList, ChevronRight, Calendar, Award, Clock, ArrowRight,
  CheckCircle2, Menu, X, LogIn, UserPlus
} from "lucide-react"

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return { isLoggedIn, setIsLoggedIn }
}
