/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator( function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  //AST生成结果
  const ast = parse(template.trim(), options)
  // console.log(ast)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  //render => _c('div',{staticStyle:{"color":"red","font-size":"20px"},attrs:{"id":"app"}},[_v(.....)]) 
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})

