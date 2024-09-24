import torch
from diffusers import FluxPipeline

pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()

prompt = "A painting of a beautiful sunset over a calm lake."
image = pipe(
  prompt, 
  height=1024,
  width=1024,
  guidance_scale=2,
  num_inference_steps=50,
  max_sequence_length=512,
  generator=torch.generator("cpu").manual_seed(0)
).images[0]

image.save("test.png")