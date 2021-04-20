package schedulers

import (
	"github.com/gin-gonic/gin/binding"
	"github.com/qw4n7y/highkick/src/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/qw4n7y/highkick/src/repo"
)

// Destroy .
func Destroy(c *gin.Context) {
	idStr := c.Param("id")
	idInt64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	scheduler := repo.GetScheduler(int(idInt64))
	if err := repo.DestroyScheduler(scheduler); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}

func Index(ctx *gin.Context) {
	schedulers, err := repo.GetSchedulers()
	if err != nil {
		ctx.JSON(422, gin.H{"msg": err})
		return
	}

	ctx.JSON(http.StatusOK, *schedulers)
}

func Show(ctx *gin.Context) {
	idStr := ctx.Param("id")
	idInt64, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		ctx.JSON(422, gin.H{"msg": err})
		return
	}

	scheduler := repo.GetScheduler(int(idInt64))

	ctx.JSON(http.StatusOK, *scheduler)
}

func CreateUpdate(c *gin.Context) {
	var scheduler models.Scheduler
	err := c.ShouldBindBodyWith(&scheduler, binding.JSON)
	if err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	if err := repo.SaveScheduler(&scheduler); err != nil {
		c.JSON(422, gin.H{"msg": err})
		return
	}

	c.JSON(http.StatusOK, scheduler)
}
