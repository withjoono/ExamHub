"use client"

import { useEffect } from "react"
import { processSSOLogin } from "@/lib/utils/sso-helper"

export function SSOListener() {
    useEffect(() => {
        const handleSSO = async () => {
            // SSO 로그인 처리 (URL에 sso_code가 있을 경우)
            const success = await processSSOLogin()

            // 성공 시 페이지 새로고침하여 로그인 상단바(User Menu) 업데이트
            if (success) {
                window.location.reload()
            }
        }

        handleSSO()
    }, []) // 마운트 시 1회 실행

    return null
}
