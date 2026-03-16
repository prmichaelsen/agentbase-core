#!/usr/bin/env npx tsx
/**
 * Generates class-validator DTO classes from openapi.yaml schemas.
 * Output: src/dto/dto.generated.ts
 *
 * Usage: npx tsx scripts/generate-dtos.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'yaml';

const SPEC_PATH = resolve(process.cwd(), 'openapi.yaml');
const OUTPUT_PATH = resolve(process.cwd(), 'src/dto/dto.generated.ts');

interface SchemaProperty {
  type?: string;
  enum?: string[];
  nullable?: boolean;
  format?: string;
  items?: SchemaProperty | { $ref: string };
  $ref?: string;
}

interface Schema {
  type: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

// Map OpenAPI types to class-validator decorators + TS types
function getValidatorAndType(prop: SchemaProperty, propName: string): { decorators: string[]; tsType: string } {
  const decorators: string[] = [];
  let tsType = 'any';

  if (prop.$ref) {
    const refName = prop.$ref.split('/').pop()!;
    decorators.push(`@ValidateNested()`);
    decorators.push(`@Type(() => ${refName}Dto)`);
    tsType = `${refName}Dto`;
    return { decorators, tsType };
  }

  if (prop.enum) {
    decorators.push(`@IsIn([${prop.enum.map(v => `'${v}'`).join(', ')}])`);
    tsType = prop.enum.map(v => `'${v}'`).join(' | ');
    return { decorators, tsType };
  }

  switch (prop.type) {
    case 'string':
      if (prop.format === 'date-time') {
        decorators.push(`@IsDateString()`);
        tsType = 'string';
      } else {
        decorators.push(`@IsString()`);
        tsType = 'string';
      }
      break;
    case 'integer':
    case 'number':
      decorators.push(`@IsNumber()`);
      tsType = 'number';
      break;
    case 'boolean':
      decorators.push(`@IsBoolean()`);
      tsType = 'boolean';
      break;
    case 'array': {
      const items = prop.items;
      if (items && '$ref' in items && items.$ref) {
        const refName = items.$ref.split('/').pop()!;
        decorators.push(`@IsArray()`);
        decorators.push(`@ValidateNested({ each: true })`);
        decorators.push(`@Type(() => ${refName}Dto)`);
        tsType = `${refName}Dto[]`;
      } else if (items && 'type' in items) {
        decorators.push(`@IsArray()`);
        switch (items.type) {
          case 'string':
            decorators.push(`@IsString({ each: true })`);
            tsType = 'string[]';
            break;
          case 'number':
          case 'integer':
            decorators.push(`@IsNumber({}, { each: true })`);
            tsType = 'number[]';
            break;
          default:
            tsType = 'any[]';
        }
      } else {
        decorators.push(`@IsArray()`);
        tsType = 'any[]';
      }
      break;
    }
    case 'object':
      decorators.push(`@IsObject()`);
      tsType = 'Record<string, unknown>';
      break;
    default:
      tsType = 'any';
  }

  return { decorators, tsType };
}

function generateDto(name: string, schema: Schema): string {
  if (!schema.properties) return '';

  const required = new Set(schema.required ?? []);
  const lines: string[] = [];

  lines.push(`export class ${name}Dto {`);

  for (const [propName, prop] of Object.entries(schema.properties)) {
    const isRequired = required.has(propName);
    const isNullable = prop.nullable === true;
    const { decorators, tsType } = getValidatorAndType(prop, propName);

    if (!isRequired) {
      lines.push(`  @IsOptional()`);
    }
    for (const dec of decorators) {
      lines.push(`  ${dec}`);
    }

    const nullSuffix = isNullable ? ' | null' : '';
    const optionalMark = isRequired ? '!' : '?';
    lines.push(`  ${propName}${optionalMark}: ${tsType}${nullSuffix};`);
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n');
}

// --- Main ---

const spec = parse(readFileSync(SPEC_PATH, 'utf-8'));
const schemas: Record<string, Schema> = spec.components?.schemas ?? {};

// Determine which decorators are used
const allDecorators = new Set<string>();
const needsType = new Set<string>(); // schemas referenced via $ref
const dtos: string[] = [];

// First pass: collect refs
for (const [, schema] of Object.entries(schemas)) {
  if (!schema.properties) continue;
  for (const prop of Object.values(schema.properties)) {
    if (prop.$ref) needsType.add(prop.$ref.split('/').pop()!);
    if (prop.items && '$ref' in prop.items && prop.items.$ref) {
      needsType.add(prop.items.$ref.split('/').pop()!);
    }
  }
}

// Second pass: generate
for (const [name, schema] of Object.entries(schemas)) {
  if (schema.type !== 'object') continue;
  if (!schema.properties) continue;

  const dto = generateDto(name, schema);
  if (dto) {
    dtos.push(dto);

    // Track decorators used
    const required = new Set(schema.required ?? []);
    for (const [propName, prop] of Object.entries(schema.properties)) {
      if (!required.has(propName)) allDecorators.add('IsOptional');
      if (prop.$ref || (prop.items && '$ref' in prop.items)) {
        allDecorators.add('ValidateNested');
      }
      if (prop.enum) allDecorators.add('IsIn');
      if (prop.type === 'string') {
        if (prop.format === 'date-time') allDecorators.add('IsDateString');
        else allDecorators.add('IsString');
      }
      if (prop.type === 'integer' || prop.type === 'number') allDecorators.add('IsNumber');
      if (prop.type === 'boolean') allDecorators.add('IsBoolean');
      if (prop.type === 'array') {
        allDecorators.add('IsArray');
        if (prop.items && 'type' in prop.items) {
          if (prop.items.type === 'string') allDecorators.add('IsString');
          if (prop.items.type === 'number' || prop.items.type === 'integer') allDecorators.add('IsNumber');
        }
      }
      if (prop.type === 'object') allDecorators.add('IsObject');
    }
  }
}

// Build imports
const validatorImports = [...allDecorators].sort().join(', ');
const hasType = needsType.size > 0;

let output = `/**
 * This file was auto-generated by scripts/generate-dtos.ts from openapi.yaml.
 * Do not make direct changes to this file.
 *
 * Requires peer dependencies: class-validator, class-transformer
 */

import { ${validatorImports} } from 'class-validator';
`;

if (hasType) {
  output += `import { Type } from 'class-transformer';\n`;
}

output += '\n' + dtos.join('\n\n') + '\n';

// Write
mkdirSync(resolve(process.cwd(), 'src/dto'), { recursive: true });
writeFileSync(OUTPUT_PATH, output);

console.log(`Generated ${dtos.length} DTOs → ${OUTPUT_PATH}`);
