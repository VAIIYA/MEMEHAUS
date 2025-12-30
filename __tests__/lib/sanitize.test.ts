import {
  sanitizeString,
  sanitizeTokenName,
  sanitizeTokenSymbol,
  sanitizeUrl,
  sanitizeTwitterHandle,
  sanitizeTelegramHandle,
  sanitizeNumber,
  sanitizePercentage,
  sanitizeFileName,
  isSafeString,
  escapeHtml,
} from '../../app/lib/sanitize';

describe('sanitize', () => {
  describe('sanitizeString', () => {
    it('removes dangerous characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
      expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeString('data:text/html,<script>alert(1)</script>')).toBe('text/html,scriptalert(1)/script');
    });

    it('limits string length', () => {
      const longString = 'a'.repeat(2000);
      expect(sanitizeString(longString, 1000)).toHaveLength(1000);
    });

    it('handles empty strings', () => {
      expect(sanitizeString('')).toBe('');
    });
  });

  describe('sanitizeTokenName', () => {
    it('allows alphanumeric and spaces', () => {
      expect(sanitizeTokenName('My Token 123')).toBe('My Token 123');
    });

    it('removes special characters', () => {
      expect(sanitizeTokenName('My@Token#123')).toBe('MyToken123');
    });

    it('replaces multiple spaces with single space', () => {
      expect(sanitizeTokenName('My    Token')).toBe('My Token');
    });

    it('limits length to 32 characters', () => {
      const longName = 'A'.repeat(50);
      expect(sanitizeTokenName(longName)).toHaveLength(32);
    });
  });

  describe('sanitizeTokenSymbol', () => {
    it('converts to uppercase', () => {
      expect(sanitizeTokenSymbol('test')).toBe('TEST');
    });

    it('removes non-alphanumeric characters', () => {
      expect(sanitizeTokenSymbol('TEST@123')).toBe('TEST123');
    });

    it('limits length to 10 characters', () => {
      const longSymbol = 'A'.repeat(15);
      expect(sanitizeTokenSymbol(longSymbol)).toHaveLength(10);
    });
  });

  describe('sanitizeUrl', () => {
    it('allows http and https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    it('rejects dangerous protocols', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('');
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('handles empty strings', () => {
      expect(sanitizeUrl('')).toBe('');
    });
  });

  describe('sanitizeTwitterHandle', () => {
    it('removes @ symbol', () => {
      expect(sanitizeTwitterHandle('@testuser')).toBe('testuser');
    });

    it('allows alphanumeric and underscores', () => {
      expect(sanitizeTwitterHandle('test_user123')).toBe('test_user123');
    });

    it('removes invalid characters', () => {
      expect(sanitizeTwitterHandle('test@user#123')).toBe('testuser123');
    });

    it('limits length to 15 characters', () => {
      const longHandle = 'a'.repeat(20);
      expect(sanitizeTwitterHandle(longHandle)).toHaveLength(15);
    });
  });

  describe('sanitizeNumber', () => {
    it('parses valid numbers', () => {
      expect(sanitizeNumber('123.45')).toBe(123.45);
    });

    it('handles invalid input', () => {
      expect(sanitizeNumber('invalid')).toBe(0);
      expect(sanitizeNumber('')).toBe(0);
    });

    it('enforces minimum value', () => {
      expect(sanitizeNumber('-10')).toBe(0);
    });

    it('enforces maximum value', () => {
      expect(sanitizeNumber('1000', 100)).toBe(100);
    });
  });

  describe('sanitizePercentage', () => {
    it('clamps values between 0 and 100', () => {
      expect(sanitizePercentage('50')).toBe(50);
      expect(sanitizePercentage('-10')).toBe(0);
      expect(sanitizePercentage('150')).toBe(100);
    });
  });

  describe('sanitizeFileName', () => {
    it('removes dangerous characters', () => {
      expect(sanitizeFileName('test@file#.txt')).toBe('testfile.txt');
    });

    it('replaces multiple dots with single dot', () => {
      expect(sanitizeFileName('test..file.txt')).toBe('test.file.txt');
    });

    it('limits length', () => {
      const longName = 'a'.repeat(300);
      expect(sanitizeFileName(longName)).toHaveLength(255);
    });
  });

  describe('isSafeString', () => {
    it('detects safe strings', () => {
      expect(isSafeString('Hello World')).toBe(true);
      expect(isSafeString('123')).toBe(true);
    });

    it('detects dangerous strings', () => {
      expect(isSafeString('<script>alert(1)</script>')).toBe(false);
      expect(isSafeString('javascript:alert(1)')).toBe(false);
      expect(isSafeString('data:text/html,<script>alert(1)</script>')).toBe(false);
    });
  });

  describe('escapeHtml', () => {
    it('escapes HTML characters', () => {
      expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
    });
  });
});
