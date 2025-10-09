const { Render, Runner } = Matter;

export function startEngine(engine, render) {
  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);
  return { runner };
}
