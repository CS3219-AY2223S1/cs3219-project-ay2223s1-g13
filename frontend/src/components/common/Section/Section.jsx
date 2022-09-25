import { ReactElement } from 'react'
import { getSectionMarginRight, getSectionWidth } from './helper'
import './Section.css'

const Section = ({
  title,
  subTitle,
  titleColor,
  subTitleColor,
  size,
  height,
  width,
  marginRight,
  background,
  children,
}) => {
  const sectionWidth = width ? width : getSectionWidth(size)
  const sectionMarginRight = marginRight
    ? marginRight
    : getSectionMarginRight(size)
  return (
    <div
      className={'section_container'}
      style={{
        height,
        background,
        width: sectionWidth,
        marginRight: sectionMarginRight,
      }}
    >
      <div>
        <div className={'section_title'} style={{ color: titleColor }}>
          {title}
        </div>
        <div className={'section_subtitle'}>
          <span
            className={'section_subtitle_button'}
            style={{ backgroundColor: subTitleColor }}
          >
            {subTitle && subTitle}
          </span>
        </div>
      </div>
      <div className={'section_body'}>{children}</div>
    </div>
  )
}

export default Section
