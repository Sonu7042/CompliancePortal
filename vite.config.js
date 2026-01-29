import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
   base: "/compliancePortal/",
  plugins: [react()],
})







// (!filters.origin ||
//         item.origin[0]?.toLowerCase() === filters.origin[0]?.toLowerCase()
//       )


{/* <td className="border p-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleSubmit(item)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Submit
                    </button>
                  </td> */}