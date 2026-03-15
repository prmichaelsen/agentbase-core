import { describe, it, expect } from 'vitest'
import { linkifyText } from './linkify.js'

describe('linkifyText', () => {
  it('converts protocol URLs to markdown links', () => {
    expect(linkifyText('Visit https://example.com today')).toBe(
      'Visit [https://example.com](https://example.com) today'
    )
  })

  it('converts www URLs with https prefix', () => {
    expect(linkifyText('Go to www.example.com')).toBe(
      'Go to [www.example.com](https://www.example.com)'
    )
  })

  it('converts bare domain URLs with https prefix', () => {
    expect(linkifyText('Check example.com')).toBe(
      'Check [example.com](https://example.com)'
    )
  })

  it('does not linkify inside code blocks', () => {
    const input = '```\nhttps://example.com\n```'
    expect(linkifyText(input)).toBe(input)
  })

  it('does not linkify inside inline code', () => {
    const input = 'Use `https://example.com` in code'
    expect(linkifyText(input)).toBe(input)
  })

  it('does not double-linkify existing markdown links', () => {
    const input = '[click here](https://example.com)'
    expect(linkifyText(input)).toBe(input)
  })

  it('does not affect markdown images', () => {
    const input = '![alt](https://example.com/img.png)'
    expect(linkifyText(input)).toBe(input)
  })

  it('handles mixed content correctly', () => {
    const input = 'Visit https://a.com and `https://b.com` and [c](https://c.com)'
    const result = linkifyText(input)
    expect(result).toContain('[https://a.com](https://a.com)')
    expect(result).toContain('`https://b.com`')
    expect(result).toContain('[c](https://c.com)')
  })

  it('returns text unchanged when no URLs', () => {
    expect(linkifyText('Hello world')).toBe('Hello world')
  })
})
