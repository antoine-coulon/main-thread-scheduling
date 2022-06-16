let lastIdleDeadline: IdleDeadline | undefined
let status: 'looping' | 'stopped' | 'stopping' = 'stopped'

export function startTrackingIdleFrames(): void {
    // support Safari
    if (typeof requestIdleCallback === 'undefined') {
        return
    }

    // istanbul ignore next
    if (status === 'looping') {
        // silentError()
        return
    }

    if (status === 'stopping') {
        status = 'looping'
        return
    }

    const loop = (): void => {
        requestIdleCallback((deadline) => {
            if (status === 'stopping') {
                status = 'stopped'
                lastIdleDeadline = undefined
            } else {
                requestIdleCallback(loop)
                lastIdleDeadline = deadline
            }
        })
    }

    loop()
}

export function stopTrackingIdleFrames(): void {
    // support Safari
    if (typeof requestIdleCallback === 'undefined') {
        return
    }

    status = 'stopping'
}

export function getLastIdleDeadline(): IdleDeadline | undefined {
    return lastIdleDeadline
}
