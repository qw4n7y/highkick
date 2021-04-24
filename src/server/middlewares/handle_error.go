package middlewares

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"net/http"
	"runtime/debug"
)

func HandleError(ctx *gin.Context) {
	defer func() {
		rec := recover()
		if rec != nil {
			err := fmt.Errorf("%+v", rec)

			requestData := map[string]interface{}{}
			ctx.ShouldBindBodyWith(&requestData, binding.JSON)

			fmt.Printf("Error on %v\nStack: %v\nMeta: %v\n",
				err, string(debug.Stack()),
				map[string]interface{}{
					"ReqURI":  ctx.Request.RequestURI,
					"ReqData": requestData,
				})

			ctx.Abort()
			ctx.JSON(http.StatusUnprocessableEntity, map[string]string{
				"error": err.Error(),
				"stack": string(debug.Stack()),
			})
		}
	}()

	ctx.Next()
}
