import { update } from 'jdenticon'
import React, { useRef, useEffect } from 'react'

interface Props {
  value: string
  size?: string
}

const Identicon = ({ value, size = '100' }: Props) => {
  const icon = useRef(null)
  useEffect(() => {
    // TODO replace this tslint hack
    update(icon.current as unknown as string, value)
  }, [value])

  return (
    <div>
      <svg data-jdenticon-value={value} height={size} ref={icon} width={size} />
    </div>
  )
}

export default Identicon
